import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Snackbar, Alert
} from '@mui/material';
import styled from 'styled-components';
import ReactPaginate from 'react-paginate';
import { searchIncomes, clearError } from '../../../redux/IncomeRelated/IncomeActions';

interface Income {
  _id: string;
  name: string;
  invoiceNumber: string;
  incomeHead: string;
  date: string;
  amount: number;
}

interface RootState {
  income: {
    incomes: Income[];
    loading: boolean;
    error: string | null;
  };
  user: {
    currentUser: { _id: string } | null;
  };
}

// Styled Components
const Container = styled(Box)`
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
  background-color: #e8c897;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

const SearchSection = styled(Box)`
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 20px;
  flex-direction: column;
  @media (min-width: 600px) {
    flex-direction: row;
  }
`;

const StyledFormControl = styled(FormControl)`
  width: 100%;
  max-width: 250px;
`;

const StyledSelect = styled(Select)`
  & .MuiInputBase-input {
    padding: 10px;
    font-size: 14px;
  }
`;

const SearchInput = styled(TextField)`
  flex-grow: 1;
  & .MuiInputBase-input {
    padding: 10px;
    font-size: 14px;
  }
`;

const StyledTableContainer = styled(TableContainer)`
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  padding: 10px;
`;

const StyledTableRow = styled(TableRow)`
  &:hover {
    background-color: #f1f1f1;
  }
`;

const DetailsSection = styled(Box)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const DetailBox = styled(Box)`
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 6px;
  background-color: #f9f9f9;
`;

const DetailHeading = styled(Typography)`
  margin-top: 0;
  color: #333;
  font-size: 18px;
  font-weight: bold;
`;

const LoadingText = styled(Typography)`
  text-align: center;
  color: #333;
  font-size: 16px;
  margin: 20px 0;
`;

const PaginationContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 10px;
`;

const SearchIncomePage: React.FC = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user || {});
  const { incomes, loading, error } = useSelector((state: RootState) => state.income || {});
  const adminID = currentUser?._id;

  const [searchType, setSearchType] = useState('Last 12 Months');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [snack, setSnack] = useState({
    open: false,
    message: '',
    severity: 'error' as 'error' | 'success' | 'warning' | 'info',
  });

  useEffect(() => {
    if (adminID) {
      dispatch(searchIncomes({ adminID, searchType, searchQuery }));
    } else {
      setSnack({ open: true, message: 'Please log in to view incomes', severity: 'error' });
    }
  }, [adminID, searchType, searchQuery, dispatch]);

  useEffect(() => {
    if (error) {
      setSnack({ open: true, message: error, severity: 'error' });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const filteredData = useMemo(() => {
    let result = [...incomes];
    const currentDate = new Date();

    if (searchType.includes('Months')) {
      const monthsAgo = new Date();
      const monthsCount = parseInt(searchType.split(' ')[1]);
      monthsAgo.setMonth(currentDate.getMonth() - monthsCount);

      result = result.filter(entry => {
        const [month, day, year] = entry.date.split('/').map(Number);
        const entryDate = new Date(year, month - 1, day);
        return entryDate >= monthsAgo;
      });
    } else if (searchType === 'Search') {
      const query = searchQuery.toLowerCase();
      result = result.filter(entry => 
        entry.name.toLowerCase().includes(query) ||
        entry.invoiceNumber.toLowerCase().includes(query)
      );
    } else if (searchType === 'Search By Income') {
      const query = searchQuery.toLowerCase();
      result = result.filter(entry => 
        entry.incomeHead.toLowerCase().includes(query) ||
        entry.amount.toString().includes(searchQuery)
      );
    }

    return result;
  }, [incomes, searchType, searchQuery]);

  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentPageData = filteredData.slice(offset, offset + itemsPerPage);

  const handleItemsPerPageChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(0);
  };

  const handleCloseSnack = () => setSnack({ ...snack, open: false });

  return (
    <Container>
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={handleCloseSnack}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnack} severity={snack.severity} sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
      <SearchSection>
        <StyledFormControl variant="outlined">
          <InputLabel id="search-type-label">Search Type</InputLabel>
          <StyledSelect
            labelId="search-type-label"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as string)}
            label="Search Type"
            aria-label="Search Type"
          >
            <MenuItem value="Last 12 Months">Last 12 Months</MenuItem>
            <MenuItem value="Last 6 Months">Last 6 Months</MenuItem>
            <MenuItem value="Last 3 Months">Last 3 Months</MenuItem>
            <MenuItem value="Search">Search</MenuItem>
            <MenuItem value="Search By Income">Search By Income</MenuItem>
          </StyledSelect>
        </StyledFormControl>
        <SearchInput
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={searchType.includes('Months')}
          variant="outlined"
          size="small"
          inputProps={{ 'aria-label': 'Search Incomes' }}
          fullWidth
        />
      </SearchSection>

      {loading ? (
        <LoadingText>Loading...</LoadingText>
      ) : (
        <>
          <StyledTableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 'bold', color: '#1a2526', border: '1px solid #ddd', p: '14px' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#1a2526', border: '1px solid #ddd', p: '14px' }}>Invoice Number</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentPageData.length > 0 ? (
                  currentPageData.map((entry) => (
                    <StyledTableRow key={entry._id}>
                      <TableCell sx={{ border: '1px solid #ddd', p: '14px' }} aria-label={`Name: ${entry.name}`}>{entry.name}</TableCell>
                      <TableCell sx={{ border: '1px solid #ddd', p: '14px' }} aria-label={`Invoice Number: ${entry.invoiceNumber}`}>{entry.invoiceNumber}</TableCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} sx={{ textAlign: 'center', color: '#999', border: '1px solid #ddd', p: '14px' }}>
                      No incomes found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </StyledTableContainer>

          <DetailsSection>
            <DetailBox>
              <DetailHeading>Income Head</DetailHeading>
              {currentPageData.map((entry) => (
                <Typography key={entry._id} sx={{ color: '#333' }}>{entry.incomeHead}</Typography>
              ))}
            </DetailBox>
            <DetailBox>
              <DetailHeading>Date</DetailHeading>
              {currentPageData.map((entry) => (
                <Typography key={entry._id} sx={{ color: '#333' }}>{entry.date}</Typography>
              ))}
            </DetailBox>
            <DetailBox>
              <DetailHeading>Amount (₹)</DetailHeading>
              {currentPageData.map((entry) => (
                <Typography key={entry._id} sx={{ color: '#333' }}>₹{entry.amount.toFixed(2)}</Typography>
              ))}
            </DetailBox>
          </DetailsSection>

          <PaginationContainer>
            <Typography sx={{ mt: 2, color: '#1a2526', textAlign: 'center' }}>
              Showing {currentPageData.length} of {filteredData.length} records
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ color: '#1a2526' }}>Items per page</Typography>
              <FormControl variant="outlined" size="small">
                <Select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  aria-label="Items per page"
                >
                  {[5, 10, 20, 30].map((num) => (
                    <MenuItem key={num} value={num}>{num}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <ReactPaginate
              previousLabel={'←'}
              nextLabel={'→'}
              pageCount={pageCount}
              onPageChange={({ selected }) => {
                setCurrentPage(selected);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              containerClassName={'pagination'}
              activeClassName={'active'}
              pageClassName={'page'}
              pageLinkClassName={'page-link'}
              previousClassName={'page'}
              nextClassName={'page'}
              breakLabel={'...'}
            />
          </PaginationContainer>
        </>
      )}
      <style jsx global>{`
        .pagination {
          display: flex;
          justify-content: center;
          list-style: none;
          padding: 0;
          margin: 20px 0;
          flex-wrap: wrap;
        }
        .page {
          margin: 0 3px;
        }
        .page-link {
          padding: 6px 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
          background-color: #f9f9f9;
          color: #1a2526;
          transition: all 0.2s ease;
          text-decoration: none;
          font-size: 14px;
          min-width: 44px;
          min-height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .page-link:hover {
          background-color: #e0e0e0;
        }
        .active .page-link {
          background: #4caf50;
          color: white;
          border-color: #4caf50;
          font-weight: bold;
        }
        @media (max-width: 600px) {
          .pagination {
            flex-direction: column;
            align-items: center;
            gap: 5px;
          }
          .page-link {
            padding: 5px 8px;
            font-size: 12px;
          }
        }
        @media (max-width: 900px) {
          .pagination {
            flex-direction: column;
            align-items: center;
            gap: 5px;
          }
          .page-link {
            padding: 5px 8px;
            font-size: 12px;
          }
        }
      `}</style>
    </Container>
  );
};

export default SearchIncomePage;