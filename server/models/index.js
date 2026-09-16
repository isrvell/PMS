import sequelize from "../config/db.js";
import User from "./User.js";
import Workspace from "./Workspace.js";
import WorkspaceMember from "./WorkspaceMember.js";
import Project from "./Project.js";
import ProjectMember from "./ProjectMember.js";
import Task from "./Task.js";
import TaskMember from "./TaskMember.js";
import TaskLink from "./TaskLink.js";
import Sprint from "./Sprint.js";
import Release from "./Release.js";
import WorkflowStatus from "./WorkflowStatus.js";
import WorkflowTransition from "./WorkflowTransition.js";
import TeamMember from "./TeamMember.js";
import Invitation from "./Invitation.js";
import Activity from "./Activity.js";
import Comment from "./Comment.js";
import SavedFilter from "./SavedFilter.js";
import SLA from "./SLA.js";
import Notification from "./Notification.js";
import Resource from "./Resource.js";
import ChatChannel from "./ChatChannel.js";
import ChatMessage from "./ChatMessage.js";
import ChatMember from "./ChatMember.js";

Workspace.belongsTo(User, { as: "owner", foreignKey: "ownerId" });

WorkspaceMember.belongsTo(User, { as: "user", foreignKey: "userId" });
WorkspaceMember.belongsTo(Workspace, { foreignKey: "workspaceId" });
Workspace.hasMany(WorkspaceMember, { as: "members", foreignKey: "workspaceId" });
User.hasMany(WorkspaceMember, { foreignKey: "userId" });

Project.belongsTo(Workspace, { foreignKey: "workspaceId" });
Workspace.hasMany(Project, { foreignKey: "workspaceId" });

ProjectMember.belongsTo(Project, { foreignKey: "projectId" });
ProjectMember.belongsTo(User, { as: "user", foreignKey: "userId" });
Project.hasMany(ProjectMember, { as: "projectMembers", foreignKey: "projectId" });

Task.belongsTo(Workspace, { foreignKey: "workspaceId" });
Task.belongsTo(Project, { as: "project", foreignKey: "projectId" });
Project.hasMany(Task, { foreignKey: "projectId" });

Task.belongsTo(Task, { as: "parent", foreignKey: "parentId" });
Task.hasMany(Task, { as: "subtasks", foreignKey: "parentId" });

Task.belongsTo(Task, { as: "epic", foreignKey: "epicId" });
Task.hasMany(Task, { as: "epicChildren", foreignKey: "epicId" });

TaskMember.belongsTo(Task, { foreignKey: "taskId" });
TaskMember.belongsTo(User, { as: "user", foreignKey: "userId" });
Task.hasMany(TaskMember, { as: "taskMembers", foreignKey: "taskId" });

TaskLink.belongsTo(Task, { as: "sourceTask", foreignKey: "sourceTaskId" });
TaskLink.belongsTo(Task, { as: "targetTask", foreignKey: "targetTaskId" });
Task.hasMany(TaskLink, { as: "outgoingLinks", foreignKey: "sourceTaskId" });
Task.hasMany(TaskLink, { as: "incomingLinks", foreignKey: "targetTaskId" });

Sprint.belongsTo(Project, { foreignKey: "projectId" });
Project.hasMany(Sprint, { foreignKey: "projectId" });
Sprint.belongsTo(Workspace, { foreignKey: "workspaceId" });
Task.belongsTo(Sprint, { as: "sprint", foreignKey: "sprintId" });
Sprint.hasMany(Task, { as: "tasks", foreignKey: "sprintId" });

Release.belongsTo(Project, { foreignKey: "projectId" });
Project.hasMany(Release, { foreignKey: "projectId" });
Release.belongsTo(Workspace, { foreignKey: "workspaceId" });
Task.belongsTo(Release, { as: "release", foreignKey: "releaseId" });
Release.hasMany(Task, { as: "tasks", foreignKey: "releaseId" });

WorkflowStatus.belongsTo(Workspace, { foreignKey: "workspaceId" });
Workspace.hasMany(WorkflowStatus, { foreignKey: "workspaceId" });
Task.belongsTo(WorkflowStatus, { as: "workflowStatus", foreignKey: "statusId" });

SavedFilter.belongsTo(Workspace, { foreignKey: "workspaceId" });
SavedFilter.belongsTo(User, { foreignKey: "userId" });

SLA.belongsTo(Workspace, { foreignKey: "workspaceId" });
Workspace.hasMany(SLA, { foreignKey: "workspaceId" });

Notification.belongsTo(Workspace, { foreignKey: "workspaceId" });
Notification.belongsTo(User, { as: "user", foreignKey: "userId" });
User.hasMany(Notification, { foreignKey: "userId" });

Comment.belongsTo(Task, { foreignKey: "taskId" });
Comment.belongsTo(User, { as: "author", foreignKey: "userId" });
Task.hasMany(Comment, { as: "comments", foreignKey: "taskId" });

TeamMember.belongsTo(Workspace, { foreignKey: "workspaceId" });
TeamMember.belongsTo(User, { as: "user", foreignKey: "userId" });
Workspace.hasMany(TeamMember, { foreignKey: "workspaceId" });

Invitation.belongsTo(Workspace, { foreignKey: "workspaceId" });
Invitation.belongsTo(User, { as: "invitedBy", foreignKey: "invitedById" });

Activity.belongsTo(Workspace, { foreignKey: "workspaceId" });
Activity.belongsTo(User, { as: "user", foreignKey: "userId" });

Resource.belongsTo(Project, { foreignKey: "projectId" });
Resource.belongsTo(Workspace, { foreignKey: "workspaceId" });
Resource.belongsTo(User, { as: "uploader", foreignKey: "uploadedBy" });
Project.hasMany(Resource, { as: "resources", foreignKey: "projectId" });

// Chat relations
ChatChannel.belongsTo(Workspace, { foreignKey: "workspaceId" });
ChatChannel.belongsTo(Project, { foreignKey: "projectId" });
ChatChannel.belongsTo(User, { as: "createdBy", foreignKey: "createdById" });
ChatChannel.hasMany(ChatMessage, { as: "messages", foreignKey: "channelId" });
ChatChannel.hasMany(ChatMember, { as: "members", foreignKey: "channelId" });

ChatMessage.belongsTo(ChatChannel, { foreignKey: "channelId" });
ChatMessage.belongsTo(User, { as: "sender", foreignKey: "senderId" });

ChatMember.belongsTo(ChatChannel, { foreignKey: "channelId" });
ChatMember.belongsTo(User, { as: "user", foreignKey: "userId" });

export {
  sequelize,
  User,
  Workspace,
  WorkspaceMember,
  Project,
  ProjectMember,
  Task,
  TaskMember,
  TaskLink,
  Sprint,
  Release,
  WorkflowStatus,
  WorkflowTransition,
  SavedFilter,
  SLA,
  TeamMember,
  Invitation,
  Activity,
  Comment,
  Notification,
  Resource,
  ChatChannel,
  ChatMessage,
  ChatMember,
};
