/**
 * ViewProjects manages construction projects.
 * Includes search, filtering by work/payment status, and full CRUD operations.
 */
import { useCallback, useEffect, useReducer } from "react"
import { useNavigate } from "react-router-dom"
import Table from "../../components/shared/Table"
import ActionMenu from "../../components/shared/ActionMenu"
import { getRequest, patchRequest, postRequest, deleteRequest } from "../../api/api"
import Modal from "../../components/shared/Modal"
import ProjectForm from "../../forms/Projects/ProjectForm"
import toast from "react-hot-toast"

const initialState = {
  projects: [],
  isLoading: true,
  pagination: null,
  params: { page: 1, name: '', work_status: 'All', payment_status: 'All' },
  addModal: false,
  editModal: false,
  selectedProject: null,
}

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_PROJECTS":
      return {
        ...state,
        projects: action.payload.projects,
        pagination: action.payload.pagination
      }

    case "SET_LOADING":
      return { ...state, isLoading: action.payload }

    case "SET_PARAMS":
      return {
        ...state,
        params: { ...state.params, ...action.payload }
      }

    case "OPEN_ADD_MODAL":
      return { ...state, addModal: true }

    case "CLOSE_ADD_MODAL":
      return { ...state, addModal: false }

    case "OPEN_EDIT_MODAL":
      return { ...state, editModal: true, selectedProject: action.payload }

    case "CLOSE_EDIT_MODAL":
      return { ...state, editModal: false, selectedProject: null }

    case "DELETE_PROJECT":
      return {
        ...state,
        projects: state.projects.filter(project => project._id !== action.payload)
      }

    default:
      return state
  }
}

const ViewProjects = () => {
  const navigate = useNavigate()
  const [state, dispatch] = useReducer(reducer, initialState)
  const { projects, isLoading, pagination, params, addModal, editModal, selectedProject } = state

  const fetchProjects = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true })
    const response = await getRequest(
      `/project?name=${params.name}&work_status=${params.work_status}&payment_status=${params.payment_status}&page=${params.page}`
    )
    if (response.success) {
      dispatch({
        type: "SET_PROJECTS",
        payload: {
          projects: response.data.projects,
          pagination: response.data.pagination
        }
      })
    }
    dispatch({ type: "SET_LOADING", payload: false })
  }, [params])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProjects()
    }, 500)
    return () => clearTimeout(timer)
  }, [fetchProjects])

  const handleChange = (e) => {
    dispatch({
      type: "SET_PARAMS",
      payload: { [e.target.name]: e.target.value, page: 1 }
    })
  }

  const handleSetPage = useCallback((updater) => {
    dispatch({ type: 'SET_PARAMS', payload: updater })
  }, [])

  const handleOpenEdit = useCallback((project) => {
    dispatch({ type: 'OPEN_EDIT_MODAL', payload: project })
  }, [])

  const handleDelete = useCallback(async (id) => {
    const response = await deleteRequest(`/project/${id}`)
    if (response.success) {
      dispatch({ type: "DELETE_PROJECT", payload: id })
      toast.success("Project deleted successfully")
    } else {
      toast.error("Failed to delete project")
    }
  }, [])

  const addProject = useCallback(async (data) => {
    const response = await postRequest('/project', data)
    if (response.success) {
      dispatch({ type: "CLOSE_ADD_MODAL" })
      fetchProjects()
      toast.success("Project added successfully")
    } else {
      toast.error("Failed to add project")
    }
  }, [fetchProjects])

  const editProject = useCallback(async (formData) => {
    const response = await patchRequest(`/project/${selectedProject._id}`, formData)
    if (response.success) {
      dispatch({ type: "CLOSE_EDIT_MODAL" })
      fetchProjects()
      toast.success("Project updated successfully")
    } else {
      toast.error("Failed to update project")
    }
  }, [selectedProject, fetchProjects])

  if (isLoading && projects.length === 0) return <span>Loading...</span>

  return (
    <div id="wrapper">
      <div id="tile">
        <h1>Manage Projects</h1>
      </div>

      <div id="operations">
        <div id="search-bar">
          <input
            type="text"
            placeholder="Search by project name"
            onChange={handleChange}
            value={params.name}
            name="name"
          />
          <select
            name="work_status"
            onChange={handleChange}
            value={params.work_status}
          >
            <option value="All">All Work Status</option>
            <option value="planning">Planning</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <select
            name="payment_status"
            onChange={handleChange}
            value={params.payment_status}
          >
            <option value="All">All Payment Status</option>
            <option value="pending">Pending</option>
            <option value="partial">Partial</option>
            <option value="paid">Paid</option>
          </select>
        </div>
        <button onClick={() => dispatch({ type: "OPEN_ADD_MODAL" })}>
          Add Project
        </button>
      </div>

      <Table
        headers={['Project', 'Client', 'Phone', 'Address', 'Work Status', 'Payment Status', 'Action']}
        data={projects}
        pagination={pagination}
        setPage={handleSetPage}
        renderRow={(project) => (
          <tr key={project._id}>
            <td>{project?.name}</td>
            <td>{project?.client_name}</td>
            <td>{project?.phone_number}</td>
            <td>{project?.address || 'N/A'}</td>
            <td>
              <span className={`status ${project?.work_status}`}>
                {project?.work_status?.replace('_', ' ')}
              </span>
            </td>
            <td>
              <span className={`status ${project?.payment_status}`}>
                {project?.payment_status}
              </span>
            </td>
            <td>
              <ActionMenu
                onView={() => navigate(`/projects/${project._id}`)}
                onEdit={() => handleOpenEdit(project)}
                onDelete={() => handleDelete(project._id)}
              />
            </td>
          </tr>
        )}
      />

      <Modal isOpen={addModal} setIsOpen={() => dispatch({ type: 'CLOSE_ADD_MODAL' })}>
        <ProjectForm
          data={{
            name: '',
            client_name: '',
            phone_number: '',
            address: '',
            work_status: 'planning',
            payment_status: 'pending'
          }}
          handleProject={addProject}
        />
      </Modal>

      <Modal isOpen={editModal} setIsOpen={() => dispatch({ type: 'CLOSE_EDIT_MODAL' })}>
        {selectedProject && (
          <ProjectForm
            data={selectedProject}
            handleProject={editProject}
          />
        )}
      </Modal>
    </div>
  )
}

export default ViewProjects