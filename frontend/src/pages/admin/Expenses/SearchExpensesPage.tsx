import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Select, MenuItem, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Grid, Card, CardContent, Snackbar, Alert, InputAdornment, FormControl, InputLabel
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import ReactPaginate from 'react-paginate';
import { getAllExpenses, clearExpenseError } from '../../../redux/expenseRelated/expenseHandle';
import { getAllExpenseHeads } from '../../../redux/expenseRelated/expenseHeadHandle';

// Styled Components
const Container = styled(Box)`
  padding: 16px;
  background-color: #f4f6f8;
  min-height: 100vh;
  @media (min-width: 960px) {
    padding: 32px;
  }
`;

const Heading = styled(Typography)`
  text-align: center;
  font-weight: 700;
  color: #1a2526;
  margin-bottom: 32px;
  font-size: 1.5rem;
  @media (min-width: 960px) {
    font-size: 2.125rem;
  }
`;

const StyledCard = styled(Card)`
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #fff;
`;

const SubHeading = styled(Typography)`
  margin-bottom: 16px;
  font-weight: 600;
  color: #1a2526;
`;

const SearchContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 16px;
  @media (min-width: 600px) {
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
  }
`;

const SearchButton = styled(Button)`
  border-radius: 20px;
  text-transform: none;
  background-color: #1976d2;
  color: white;
  &:hover {
    background-color: #115293;
  }
`;

const AddButton = styled(Button)`
  border-radius: 20px;
  text-transform: none;
  background-color: #2e7d32;
  color: white;
  &:hover {
    background-color: #1b5e20;
  }
`;

const StyledTableContainer = styled(TableContainer)`
  box-shadow: none;
  background-color: #fff;
`;

const StyledTableRow = styled(TableRow)`
  &:nth-of-type(odd) {
    background-color: #f9f9f9;
  }
  &:hover {
    background-color: #e0f7fa;
  }
`;

const PaginationContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 10px;
`;

const SearchExpensesPage = () => {
  const [searchType, setSearchType] = useState('last6months');
  const [searchQuery, setSearchQuery] = useState('');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  const dispatch = useDispatch();
  const expenseState = useSelector((state) => state.expense || { expensesList: [], loading: false, error: null });
  const expenseHeadState = useSelector((state) => state.expenseHead || { expenseHeadsList: [], loading: false, error: null });
  const userState = useSelector((state) => state.user || {});
  const { expensesList, loading, error } = expenseState;
  const { expenseHeadsList } = expenseHeadState;
  const adminID = userState.currentUser?._id;

  const timeFilters = [
    { value: 'today', label: 'Today' },
    { value: 'thisweek', label: 'This Week' },
    { value: 'lastweek', label: 'Last Week' },
    { value: 'thismonth', label: 'This Month' },
    { value: 'lastmonth', label: 'Last Month' },
    { value: 'last6months', label: 'Last 6 Months' },
    { value: 'last12months', label: 'Last 12 Months' },
    { value: 'custom', label: 'Custom Date' },
    { value: 'byExpense', label: 'Search by Expense' },
  ];

  useEffect(() => {
    if (adminID) {
      dispatch(getAllExpenses(adminID));
      dispatch(getAllExpenseHeads(adminID));
    } else {
      setSnack({ open: true, message: 'Please log in to view expenses', severity: 'error' });
    }
  }, [dispatch, adminID]);

  useEffect(() => {
    if (error) {
      setSnack({ open: true, message: error, severity: 'error' });
      dispatch(clearExpenseError());
    }
  }, [error, dispatch]);

  const getDateRange = (filter) => {
    const today = new Date();
    switch (filter) {
      case 'today':
        return {
          start: new Date(today.setHours(0, 0, 0, 0)),
          end: new Date(today.setHours(23, 59, 59, 999)),
        };
      case 'thisweek':
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        return {
          start: new Date(startOfWeek.setHours(0, 0, 0, 0)),
          end: new Date(today.setHours(23, 59, 59, 999)),
        };
      case 'lastweek':
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7 - today.getDay());
        return {
          start: new Date(lastWeek.setHours(0, 0, 0, 0)),
          end: new Date(lastWeek.setDate(lastWeek.getDate() + 6)),
        };
      case 'thismonth':
        return {
          start: new Date(today.getFullYear(), today.getMonth(), 1),
          end: new Date(today.getFullYear(), today.getMonth() + 1, 0),
        };
      case 'lastmonth':
        return {
          start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
          end: new Date(today.getFullYear(), today.getMonth(), 0),
        };
      case 'last6months':
        return {
          start: new Date(today.setMonth(today.getMonth() - 6)),
          end: new Date(),
        };
      case 'last12months':
        return {
          start: new Date(today.setMonth(today.getMonth() - 12)),
          end: new Date(),
        };
      case 'custom':
        return {
          start: customStartDate ? new Date(customStartDate) : null,
          end: customEndDate ? new Date(customEndDate) : null,
        };
      default:
        return { start: null, end: null };
    }
  };

  const handleSearch = () => {
    let results = [];

    if (searchType === 'byExpense') {
      results = expensesList.filter((expense) =>
        Object.values(expense).some((value) =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      const { start, end } = getDateRange(searchType);
      if (start && end) {
        results = expensesList.filter((expense) => {
          const expenseDate = new Date(expense.date);
          return expenseDate >= start && expenseDate <= end;
        });
      } else {
        results = expensesList;
      }
    }

    setFilteredExpenses(results);
    setCurrentPage(0); // Reset to first page on new search
  };

  useEffect(() => {
    handleSearch();
  }, [searchType, searchQuery, customStartDate, customEndDate, expensesList]);

  const handleCloseSnack = () => setSnack({ ...snack, open: false });

  const pageCount = Math.ceil(filteredExpenses.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentPageData = filteredExpenses.slice(offset, offset + itemsPerPage);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(0);
  };

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
      <Heading variant="h4">Search Expenses</Heading>
      <Grid container spacing={3}>
        {/* Search Criteria Section */}
        <Grid item xs={12}>
          <StyledCard>
            <CardContent>
              <SubHeading variant="h6">Select Search Criteria</SubHeading>
              <SearchContainer>
                <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel id="search-type-label">Search Type</InputLabel>
                  <Select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    label="Search Type"
                    labelId="search-type-label"
                    size="small"
                    aria-label="Search Type"
                  >
                    {timeFilters.map((filter) => (
                      <MenuItem key={filter.value} value={filter.value}>
                        {filter.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {searchType === 'byExpense' && (
                  <TextField
                    fullWidth
                    label="Search expenses"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    variant="outlined"
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                    placeholder="Search by name, description, or amount..."
                    inputProps={{ 'aria-label': 'Search expenses' }}
                    sx={{ maxWidth: 300 }}
                  />
                )}

                {searchType === 'custom' && (
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                    <TextField
                      type="date"
                      label="Start Date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                      size="small"
                      sx={{ minWidth: 150 }}
                      inputProps={{ 'aria-label': 'Start Date' }}
                    />
                    <Typography>to</Typography>
                    <TextField
                      type="date"
                      label="End Date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                      size="small"
                      sx={{ minWidth: 150 }}
                      inputProps={{ min: customStartDate, 'aria-label': 'End Date' }}
                    />
                  </Box>
                )}

                <SearchButton
                  variant="contained"
                  onClick={handleSearch}
                  startIcon={<SearchIcon />}
                  aria-label="Search Expenses"
                >
                  Search Now
                </SearchButton>
              </SearchContainer>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Expense List Section */}
        <Grid item xs={12}>
          <StyledCard>
            <CardContent>
              <SubHeading variant="h6">Expense List</SubHeading>
              <StyledTableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#1a2526' }}>
                      {['Name', 'Invoice Number', 'Expense Head', 'Date', 'Amount (₹)'].map((header) => (
                        <TableCell
                          key={header}
                          sx={{
                            color: '#fff',
                            fontWeight: 600,
                            fontSize: { xs: '0.75rem', md: '0.875rem' },
                            p: { xs: 1, md: 2 },
                          }}
                        >
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} sx={{ textAlign: 'center', color: '#1a2526' }}>
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : currentPageData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} sx={{ textAlign: 'center', p: 4, color: '#666' }}>
                          <Typography>No matching expenses found</Typography>
                          <AddButton
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => window.location.href = '/add-expenses'}
                            aria-label="Add New Expense"
                            sx={{ mt: 2 }}
                          >
                            Add New Expense
                          </AddButton>
                          <Typography sx={{ mt: 1 }}>or try different search criteria</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentPageData.map((expense, idx) => (
                        <StyledTableRow key={expense._id}>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {expense.name}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {expense.invoiceNumber}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {expense.expenseHead}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            {new Date(expense.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell sx={{ p: { xs: 1, md: 2 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            ₹{parseFloat(expense.amount).toFixed(2)}
                          </TableCell>
                        </StyledTableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </StyledTableContainer>
              <PaginationContainer>
                <Typography sx={{ mt: 2, color: '#1a2526', textAlign: 'center' }}>
                  Showing {currentPageData.length} of {filteredExpenses.length} records
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ color: '#1a2526' }}>Items per page</Typography>
                  <FormControl variant="outlined" size="small" sx={{ minWidth: 80 }}>
                    <InputLabel id="items-per-page-label">Items</InputLabel>
                    <Select
                      value={itemsPerPage}
                      onChange={handleItemsPerPageChange}
                      label="Items"
                      labelId="items-per-page-label"
                      aria-label="Items per page"
                    >
                      {[5, 10, 20, 30].map((num) => (
                        <MenuItem key={num} value={num}>
                          {num}
                        </MenuItem>
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
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
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

export default SearchExpensesPage;