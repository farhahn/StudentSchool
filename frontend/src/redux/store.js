import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from './userRelated/userSlice';
import { studentReducer } from './studentRelated/studentSlice';
import { noticeReducer } from './noticeRelated/noticeSlice';
import { sclassReducer } from './sclassRelated/sclassSlice';
import { teacherReducer } from './teacherRelated/teacherSlice';
import { complainReducer } from './complainRelated/complainSlice';
import classReducer from './fclass/fclassSlice.js';
import sectionReducer from './sectionRelated/sectionSlice.js';
import subjectSlice from './subjectRelated/subjectSlice.js';
import complaintReducer from "./FrontOffice/Enquiry/complaintSlice.js";
import admissionEnquiryReducer from './FrontOffice/Enquiry/admissionEnquirySlice.js';
import postalDispatchReducer from './FrontOffice/Enquiry/postalDispatchSlice.js';
import postalReceiveReducer from './FrontOffice/Enquiry/postalReceiveSlice.js';
import phoneCallLogsReducer from "./expenseRelated/phoneSlice.js";
import frontOfficeReducer from './FrontOffice/Enquiry/frontOfficeSlice.js';
import visitorReducer from './FrontOffice/Enquiry/VisitorSlice.js';
import incomeReducer from './IncomeRelated/IncomeSlice.js';
import expenseReducer from "./expenseRelated/expenseSlice.js";
import expenseHeadReducer from "./expenseRelated/expenseHeadSlice.js";
import transportRouteReducer from './TransportRelated/routeSlice.js';
import vehicleReducer from "./TransportRelated/vehicleSlice.js";
import assignmentReducer from './TransportRelated/AssignmentSlice.js';
import pickupPointReducer from './TransportRelated/PickupPointSlice.js';
import routePickupPointReducer from './TransportRelated/route-pickup-pointSlice.js';
import studentsReducer from './StudentAddmissionDetail/studentAddmissionSlice.js';
import admissionFormReducer from './StudentAddmissionDetail/studentAddmissionSlice';
import studentSearchReducer from './StudentAddmissionDetail/studentSearchSlice.js';
import bulkDeleteReducer from './StudentAddmissionDetail/bulkDeleteSlice.js';
import categoryReducer from './StudentAddmissionDetail/categorySlice.js';
import houseReducer from './StudentAddmissionDetail/houseSlice.js';
import reasonReducer from './StudentAddmissionDetail/reasonSlice.js';
import disabledStudentReducer from './StudentAddmissionDetail/disabledStudentSlice.js';
import teacherFormReducer from './TeacherAllRelated/formSlice.js';
import teacherManageReducer from './TeacherAllRelated/teacherManageSlice';





// import { librariansReducer } from './librarianrelated/librarianSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        student: studentReducer,
        teacher: teacherReducer,
        notice: noticeReducer,
        complaint: complainReducer,
        sclass: sclassReducer,
        fclass: classReducer,
        sections: sectionReducer,
        subject: subjectSlice, 
        complaints: complaintReducer,
        admissionEnquiry: admissionEnquiryReducer,
        postalDispatch: postalDispatchReducer,
        postalReceive: postalReceiveReducer,
        phoneCallLogs: phoneCallLogsReducer,
        frontOffice: frontOfficeReducer,
         visitor: visitorReducer,
         income: incomeReducer,
         expense: expenseReducer,
         expenseHead: expenseHeadReducer,
         transportRoute: transportRouteReducer,
          vehicle: vehicleReducer,
           assignment: assignmentReducer,
           pickupPoint: pickupPointReducer,
           routePickupPoint: routePickupPointReducer,
            students: studentsReducer,
             admissionForms: admissionFormReducer,
             studentSearch: studentSearchReducer,
             bulkDelete: bulkDeleteReducer,
             category: categoryReducer,
             house: houseReducer,
             reason: reasonReducer,
             disabledStudent: disabledStudentReducer,
             teacherForm: teacherFormReducer,
            teacherManage: teacherManageReducer,
        // librarians: librariansReducer, // ✅ Key should match useSelector()
    },
});

export default store;
