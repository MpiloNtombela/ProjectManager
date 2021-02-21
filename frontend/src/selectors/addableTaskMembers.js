import {createSelector} from "reselect";

const projectMembersSelector = state => state.projectsState.project.members
const taskMembersSelector = state => state.tasksState.task.members

// let s = l2.filter(g=> !l.map(d=> d.id).includes(g.id))
const getAddableTaskMembers = (projectMembers, taskMembers) => {
  if (!projectMembers || !taskMembers.length) {
    return projectMembers
  }
  return projectMembers.filter(
    member => !taskMembers.map(t => t.id).includes(member.id)
  )
}

export default createSelector(
  projectMembersSelector,
  taskMembersSelector,
  getAddableTaskMembers
)