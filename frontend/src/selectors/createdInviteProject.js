import {createSelector} from "reselect";

const projectsSelector = state => state.projectsState.projects

const partition = (arr, callFunc) => arr.reduce((acc, current) => {
  acc[callFunc(current) ? 0 : 1].push(current)
  return acc
}, [[], []])


const sortProjects = (projects) => {
  if (!projects) return
  const [created, joined] = partition(projects, project => {
    return project["is_creator"];
  })
  return {created, joined}
}

export default createSelector(
  projectsSelector,
  sortProjects,
)