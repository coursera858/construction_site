import { useCallback, useEffect, useReducer } from "react"
import { useNavigate } from "react-router-dom"
import { getRequest, patchRequest, postRequest, deleteRequest } from "../../api/api"
import { MdChevronLeft, MdChevronRight } from "react-icons/md"
import ActionMenu from "../../components/shared/ActionMenu"
import Modal from "../../components/shared/Modal"
import AssetForm from "../../forms/Assets/AssetForm"
import toast from "react-hot-toast"
import "../../styles/assets.css"

const initialState = {
  assets: null,
  isLoading: true,
  pagination: null,
  params: { page: 1, name: '', type: 'All' },
  addModal: false,
  editModal: false,
  selectedAsset: null,
}

const reducer = (state, action) => {
  switch (action.type) {

    case "SET_ASSETS":
      return {
        ...state,
        assets: action.payload.assets,           
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
      return { ...state, editModal: true, selectedAsset: action.payload }

    case "CLOSE_EDIT_MODAL":
      return { ...state, editModal: false, selectedAsset: null }

    case "ADD_ASSET":
      return { ...state, assets: [action.payload, ...state.assets] }

    case "UPDATE_ASSET":
      return {
        ...state,
        assets: state.assets.map(asset =>
          asset._id === action.payload._id ? action.payload : asset
        )
      }

    case "DELETE_ASSET":
      return {
        ...state,
        assets: state.assets.filter(asset => asset._id !== action.payload)
      }

    default:
      return state
  }
}

const ViewAssets = () => {
  const navigate = useNavigate()
  const [state, dispatch] = useReducer(reducer, initialState)
  const { assets, isLoading, pagination, params, addModal, editModal, selectedAsset } = state


  const fetchAssets = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true })
    const response = await getRequest(
      `/assets?name=${params.name}&type=${params.type}&page=${params.page}`
    )
    if (response.success) {

      dispatch({
        type: "SET_ASSETS",
        payload: {
          assets: response.data.assets,
          pagination: response.data.pagination
        }
      })
    }
    dispatch({ type: "SET_LOADING", payload: false })
  }, [params])


  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAssets()
    }, 500)
    return () => clearTimeout(timer)
  }, [fetchAssets])

  const handleChange = (e) => {
    dispatch({
      type: "SET_PARAMS",
      payload: { [e.target.name]: e.target.value, page: 1 } 
    })
  }

  const handleSetPage = (updater) => {
    dispatch({ type: 'SET_PARAMS', payload: updater })
  }

  const handleOpenEdit = useCallback((asset) => {
    dispatch({ type: 'OPEN_EDIT_MODAL', payload: asset })
  }, [])

  const handleDelete = useCallback(async (id) => {
    const response = await deleteRequest(`/assets/${id}`)
    if (response.success) {
      dispatch({ type: "UPDATE_ASSET", payload: response.data })
      toast.success(`Asset ${response.data.isActive ? "activated" : "deactivated"} successfully`)
    } else {
      toast.error("Failed to delete asset")
    }
  }, [])

  const addAssets = useCallback(async (data) => {
    const response = await postRequest('/assets', data)
    if (response.success) {
      dispatch({ type: "CLOSE_ADD_MODAL" })
      dispatch({ type: "ADD_ASSET", payload: response.data })
      toast.success("Asset added successfully")
    } else {
      toast.error("Failed to add asset")
    }
  }, [])

  const editAssets = useCallback(async (formData) => {
    const response = await patchRequest(`/assets/${selectedAsset._id}`, formData)
    if (response.success) {
      dispatch({ type: "CLOSE_EDIT_MODAL" })
      dispatch({ type: "UPDATE_ASSET", payload: response.data })
      toast.success("Asset updated successfully")
    } else {
      toast.error("Failed to update asset")
    }
  }, [selectedAsset])

  if (isLoading) return <span>Loading...</span>

  return (
    <div id="wrapper">

      <div id="tile">
        <h1>Documents / Assets</h1>
      </div>

      <div id="operations">
        <div id="search-bar">
          <input
            type="text"
            placeholder="Search assets..."
            onChange={handleChange}
            value={params.name}
            name="name"
          />
          <select
            name="type"
            id="asset_type"
            onChange={handleChange}
            value={params.type}
          >
            <option value="All">All types</option>
            <option value="vehicle">Vehicles</option>
            <option value="tools">Tools</option>
          </select>
        </div>
        <button onClick={() => dispatch({ type: "OPEN_ADD_MODAL" })}>
          + Upload Asset
        </button>
      </div>

      <div className="assets-grid">
        {assets && assets.length > 0 ? (
          assets.map((asset) => (
            <div className="asset-card" key={asset._id}>
              
              <div className="ac-header">
                <img
                  className="ac-icon"
                  src={asset?.image || "https://via.placeholder.com/150"}
                  alt={asset?.name}
                />
                
                <div className="ac-top-right">
                  <ActionMenu
                    onView={() => navigate(`/assets/${asset._id}`)}
                    onEdit={() => handleOpenEdit(asset)}
                    onDelete={() => handleDelete(asset._id)}
                  />
                  <span className="ac-count">{asset?.count} Units</span>
                </div>
              </div>

              <div className="ac-body">
                <div className="ac-title">{asset?.name}</div>
                
                <div className="ac-details-stack">
                  <span className={`ac-status-badge ${asset?.isActive ? 'active' : 'inactive'}`}>
                    {asset?.isActive ? "Active" : "Inactive"}
                  </span>
                  <span className="ac-type">Type: {asset?.asset_type.charAt(0).toUpperCase() + asset?.asset_type.slice(1)}</span>
                  <span className="ac-desc">{asset?.description}</span>
                </div>
              </div>
              
            </div>
          ))
        ) : (
          <div style={{ color: 'var(--muted-text)', gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
            No assets found matching your criteria.
          </div>
        )}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="grid-pagination">
          <button
            disabled={pagination.currentPage === 1}
            onClick={() => handleSetPage({ ...params, page: pagination.currentPage - 1 })}
          >
            <MdChevronLeft size={20} />
          </button>
          <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
          <button
            disabled={pagination.currentPage === pagination.totalPages}
            onClick={() => handleSetPage({ ...params, page: pagination.currentPage + 1 })}
          >
            <MdChevronRight size={20} />
          </button>
        </div>
      )}

      <Modal isOpen={addModal} setIsOpen={() => dispatch({ type: 'CLOSE_ADD_MODAL' })}>
        <AssetForm
          data={{ name: '', asset_type: '', count: '', description: '', image: '' }}
          handleAsset={addAssets}
        />
      </Modal>

      <Modal isOpen={editModal} setIsOpen={() => dispatch({ type: 'CLOSE_EDIT_MODAL' })}>
        {selectedAsset && (
          <AssetForm
            data={selectedAsset}
            handleAsset={editAssets}
          />
        )}
      </Modal>

    </div>
  )
}

export default ViewAssets