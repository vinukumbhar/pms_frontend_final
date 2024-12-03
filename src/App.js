import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SidebarComponent from "./Sidebar/Sidebar";
import Insights from "./Pages/Insights";
import Account from "./Pages/Account";
import Contact from "./Pages/Contact";
import ErrorPage from "./Pages/ErrorPage";
import Tasks from "./Templates/Task/Tasks";
import Tags from "./Templates/Tags/Tags";
import EmailTemp from "./Templates/EmailTemp/EmailTemp";
import Templates from "./Pages/Templates";
import JobTemp from "./Templates/JobsTemp/JobTemp";
import JobTemplateUpdate from "./Templates/JobsTemp/JobTemplateUpdate";
import PipelineTemp from "./Templates/PipelineTemp/PipelineTemp";
import FolderTemp from "./Templates/FoldersTemp/FolderTemp";
import ChatTemp from "./Templates/ChatsTemp/ChatTemp";

import InvoiceTemp from "./Templates/InvoicesTemp/InvoiceTemp";
import OrganizerTemp from "./Templates/OrganizersTemp/OrganizerTemp";
import OrganizersTempUpdate from "./Templates/OrganizersTemp/OrganizersTempUpdate.js";
import RecurringInvoiceTemp from "./Templates/RecurringInvoiceTemp/RecurringInvoiceTemp";
import SignatureTemp from "./Templates/SignatureTemp/SignatureTemp";
import ProposalTemp from "./Templates/ProposalsTemp/ProposalTemp";
import ProposalTempUpdate from "./Templates/ProposalsTemp/PrposalTempUpdate";
import CreateJob from "./Jobs/CreateJob";
import Docs from "./Pages/Docs";
import AccountDash from "./Pages/AccountDash.js";
import Invoices from "./Billing/Invoices";
import Services from "./Pages/Service";
import MyAccount from "./Settings/MyAccount";
import Pipeline from "./Workflow/Pipeline";
import WorkflowTask from "./Workflow/Tasks";
import TeamMember from "./Users/TeamMember.js";
import Jobs from "./Pages/Jobs.js";
import PipelineTempUpdate from "./Templates/PipelineTemp/PipelineTempUpdate.js";
import TasksUpdate from "./Templates/Task/TasksUpdate.js";
import EmailTempUpdate from "./Templates/EmailTemp/EmailTempUpdate.js";

import Overview from "./nested-navbar/NewPages/Overview.js";
import Notes from "./nested-navbar/NewPages/Notes.js";
import Workflow from "./nested-navbar/NewPages/Workflow";
import Pipelines from "./nested-navbar/workflow-nav/Pipelines";
import ActiveJobs from "./nested-navbar/workflow-nav/ActiveJobs";
import ArchivedJobs from "./nested-navbar/workflow-nav/ArchivedJobs";
import Info from "./nested-navbar/NewPages/Info";
import Proposals from "./nested-navbar/NewPages/Proposals";
import DashDocs from "./nested-navbar/NewPages/Docs";
import Communication from "./nested-navbar/NewPages/Commuication";
import Organizers from "./nested-navbar/NewPages/Organizers";
import AccountInvoice from "./nested-navbar/NewPages/Invoices.js";
import Email from "./nested-navbar/NewPages/Email";
import Inbox from "./nested-navbar/email-nav/Inbox";
import Sent from "./nested-navbar/email-nav/Sent";
import Payments from "./nested-navbar/invoices-nav/Payments";
import Invoice from "./nested-navbar/invoices-nav/Invoice";

import Documents from "./nested-navbar/documents-nav/Documents";
import Approvals from "./nested-navbar/documents-nav/Approvals";
import Signatures from "./nested-navbar/documents-nav/Signatures";
import FileRequest from "./nested-navbar/documents-nav/FileRequest";
import Trash from "./nested-navbar/documents-nav/Trash";
import IRS from "./nested-navbar/documents-nav/IRS";
import InvoiceTempUpdate from "./Templates/InvoicesTemp/InvoiceTempUpdate.js";
import ChatTempUpdate from "./Templates/ChatsTemp/ChatTempUpdate.js";
import ServicesUpdate from "./Pages/ServiceUpdate.js";
import PreviewOrganizer from "./Templates/OrganizersTemp/PreviewOranizer.js";

import ForgotPassword from "./Admin-login-signup/Forgotpassword.js";
import ResetPassword from "./Admin-login-signup/ResetPassword.js";
import Adminsignup from "./Admin-login-signup/newsignup.js";
import AdminLogin from "./Admin-login-signup/Login";
import ClientfacingJob from "./Templates/ClientFacingJobs/clientfacing";
import ActiveAccounts from "./Users/ActiveAccounts";
import UpdateTeamMember from "./Users/UpdateTeamMember";
import ActiveMember from "./Users/ActiveMember";
import Deactivatemember from "./Users/DeactivateMember";
import Stages from "./Pages/stagesAutomation";
import FirmSettings from "./Settings/FirmSetting";
import InvoiceUpdate from "./Billing/invoiceUpdate.js";
import AccountOrganizer from "./nested-navbar/NewPages/AccountOrganizer";

import Inboxplus from './Inboxplus/Inboxplus.js';

import AccountWiseProposal from "./nested-navbar/Proposals/PrposalTempUpdate.js"
import AccountWiseProposalUpdate from "./nested-navbar/Proposals/ProposalAccWiseUpdate.js"
import ProposalsELS from './Billing/Proposals&ELS/ProposalsEls.js'
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/signup" element={<Adminsignup />} />

        <Route path="/forgotpass" element={<ForgotPassword />} />
        <Route path="/resetpassword/:id/:token" element={<ResetPassword />} />
        <Route path="/activate/:_id/:token" element={<ActiveAccounts />} />
        <Route path="/" element={<SidebarComponent />}>
          <Route index element={<Insights />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="clients/accounts" element={<Account />} />
          <Route path="clients/contacts" element={<Contact />} />
          <Route path="stages" element={<Stages />} />
          <Route path="addJobs" element={<CreateJob />} />
          <Route path="billing/Invoices" element={<Invoices />} />
          <Route path="billing/Invoices/Updateinvoice/:_id" element={<InvoiceUpdate />} />
          <Route path='billing/proposalsandels' element={<ProposalsELS/>}/>
          <Route path="workflow/tasks" element={<WorkflowTask />} />
          <Route path="workflow/jobs" element={<Jobs />} />
          <Route path="workflow/pipelines" element={<Pipeline />} />
          <Route path="/organizerpreview" element={<PreviewOrganizer />} />
          <Route path="firmtemp/templates" element={<Templates />}>
            <Route path="tasks" element={<Tasks />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="tasks/taskTempUpdate/:_id" element={<TasksUpdate />} />
            <Route path="tags" element={<Tags />} />
            <Route path="emails" element={<EmailTemp />} />
            <Route path="emails/emailTempUpdate/:_id" element={<EmailTempUpdate />} />
            <Route path="jobs" element={<JobTemp />} />
            <Route path="jobs/JobTemplateUpdate/:_id" element={<JobTemplateUpdate />} />
            <Route path="clientfacing" element={<ClientfacingJob />} />
            <Route path="pipelines" element={<PipelineTemp />} />
            <Route path="pipelines/PipelineTemplateUpdate/:id" element={<PipelineTempUpdate />} />
            <Route path="folders" element={<FolderTemp />} />
            <Route path="chats" element={<ChatTemp />} />
            <Route path="chats/chatTemplateUpdate/:id" element={<ChatTempUpdate />} />

            <Route path="invoices" element={<InvoiceTemp />} />
            <Route path="invoices/invoiceTempUpdate/:id" element={<InvoiceTempUpdate />} />
            <Route path="organizers" element={<OrganizerTemp />} />
            <Route path="organizers/OrganizerTempUpdate/:id" element={<OrganizersTempUpdate />} />
            <Route path="recurring-invoices" element={<RecurringInvoiceTemp />} />
            <Route path="signatures" element={<SignatureTemp />} />
            <Route path="proposals" element={<ProposalTemp />} />
            <Route path="proposals/ProposalTempUpdate/:_id" element={<ProposalTempUpdate />} />
          </Route>
          <Route path="/firmtemp/teammember" element={<TeamMember />}>
            <Route path="activemember" element={<ActiveMember />} />

            <Route path="deactivatemember" element={<Deactivatemember />} />
          </Route>
          <Route path="/updateteammember/:id" element={<UpdateTeamMember />} />
          {/* <Route path='/firmtemp/services' element={<Services/>}/> */}
          <Route path="/firmtemp/service" element={<Services />} />
          {/* <Route path='/firmtemp/services/ServicesUpdate/:id' element={ServicesUpdate}/> */}
          <Route path="/servicesUpdate/:id" element={<ServicesUpdate />} />
          <Route path="/settings/myaccount" element={<MyAccount />} />
          <Route path='/inbox+' element={<Inboxplus/>}/>




          <Route path="/settings/firmsettings" element={<FirmSettings />} />
          <Route path="/accountsdash" element={<AccountDash />}>
            <Route path="overview/:data" element={<Overview />} />
            <Route path="info/:data" element={<Info />} />
            <Route path="docs/:data" element={<DashDocs />}>
              <Route path="documents" element={<Documents />} />
              <Route path="approvals" element={<Approvals />} />
              <Route path="signatures" element={<Signatures />} />
              <Route path="filerequests" element={<FileRequest />} />
              <Route path="trash" element={<Trash />} />
              <Route path="irs" element={<IRS />} />
            </Route>
            <Route path="communication/:data" element={<Communication />} />
            <Route path="organizers/:data" element={<Organizers />} />
            <Route path="organizers/:data/accountorganizer" element={<AccountOrganizer />} />
            {/* <Route path="/organizerpreview" element={<PreviewOrganizer />} /> */}
            <Route path="invoices/:data" element={<AccountInvoice />}>
              <Route path="invoice" element={<Invoice />} />
              <Route path="payments" element={<Payments />} />
            </Route>
            <Route path="email/:data" element={<Email />}>
              <Route path="inbox" element={<Inbox />} />
              <Route path="sent" element={<Sent />} />
            </Route>
            <Route path="proposals/:data" element={<Proposals />} />
            <Route path="proposals/:data/new" element={<AccountWiseProposal/>}/>
          <Route path="proposals/:data/update/:_id" element={<AccountWiseProposalUpdate/>}/>
            <Route path="notes/:data" element={<Notes />} />

            <Route path="workflow/:data" element={<Workflow />}>
              <Route path="pipelines" element={<Pipelines />} />
              <Route path="activejobs" element={<ActiveJobs />} />
              <Route path="archivedjobs" element={<ArchivedJobs />} />
            </Route>
          </Route>
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

{
  /* <Route path='/signup' element={<Adminsignup />} /> */
}
{
  /* <Route path='/newlogin' element={<AdminLogin/>}/> */
}
// import Adminsignup from './Admin-login-signup/adminSignup.js'
// import AdminLogin from './Admin-login-signup/adminLogin.js'
