/**
 * ViewAssetsBooking manages asset rentals/bookings.
 * Includes search, filtering by return/payment status, and full CRUD operations.
 */
import { useCallback, useEffect, useReducer } from "react"
import { useNavigate } from "react-router-dom"
import Table from "../../components/shared/Table"
import ActionMenu from "../../components/shared/ActionMenu"
import { getRequest, patchRequest, postRequest, deleteRequest } from "../../api/api"
import Modal from "../../components/shared/Modal"
import BookingForm from "../../forms/Assets/BookingForm"
import toast from "react-hot-toast"

const initialState = {
  bookings: [],
  isLoading: true,
  pagination: null,
  params: { page: 1, name: '', returned_status: 'All', payment_status: 'All' },
  addModal: false,
  editModal: false,
  selectedBooking: null,
}

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_BOOKINGS":
      return {
        ...state,
        bookings: action.payload.bookings,
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
      return { ...state, editModal: true, selectedBooking: action.payload }

    case "CLOSE_EDIT_MODAL":
      return { ...state, editModal: false, selectedBooking: null }

    case "ADD_BOOKING":
      return { ...state, bookings: [action.payload, ...state.bookings] }

    case "UPDATE_BOOKING":
      return {
        ...state,
        bookings: state.bookings.map(booking =>
          booking._id === action.payload._id ? action.payload : booking
        )
      }

    case "DELETE_BOOKING":
      return {
        ...state,
        bookings: state.bookings.filter(booking => booking._id !== action.payload)
      }

    default:
      return state
  }
}

const ViewAssetsBooking = () => {
  const navigate = useNavigate()
  const [state, dispatch] = useReducer(reducer, initialState)
  const { bookings, isLoading, pagination, params, addModal, editModal, selectedBooking } = state

  const fetchBookings = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true })
    const response = await getRequest(
      `/booking?name=${params.name}&returned_status=${params.returned_status}&payment_status=${params.payment_status}&page=${params.page}`
    )
    if (response.success) {
      dispatch({
        type: "SET_BOOKINGS",
        payload: {
          bookings: response.data.bookings,
          pagination: response.data.pagination
        }
      })
    }
    dispatch({ type: "SET_LOADING", payload: false })
  }, [params])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBookings()
    }, 500)
    return () => clearTimeout(timer)
  }, [fetchBookings])

  const handleChange = (e) => {
    dispatch({
      type: "SET_PARAMS",
      payload: { [e.target.name]: e.target.value, page: 1 }
    })
  }

  const handleSetPage = useCallback((updater) => {
    dispatch({ type: 'SET_PARAMS', payload: updater })
  }, [])

  const handleOpenEdit = useCallback((booking) => {
    dispatch({ type: 'OPEN_EDIT_MODAL', payload: booking })
  }, [])

  const handleDelete = useCallback(async (id) => {
    const response = await deleteRequest(`/booking/${id}`)
    if (response.success) {
      dispatch({ type: "DELETE_BOOKING", payload: id })
      toast.success("Booking deleted successfully")
    } else {
      toast.error("Failed to delete booking")
    }
  }, [])

  const addBooking = useCallback(async (data) => {
    const response = await postRequest('/booking', data)
    console.log(response)
    if (response.success) {
      dispatch({ type: "CLOSE_ADD_MODAL" })
      // Fetch bookings again to get populated asset data if necessary, 
      // or manually add if the response contains it.
      fetchBookings()
      toast.success("Booking added successfully")
    } else {
      toast.error("Failed to add booking")
    }
  }, [fetchBookings])

  const editBooking = useCallback(async (formData) => {
    const response = await patchRequest(`/booking/${selectedBooking._id}`, formData)
    if (response.success) {
      dispatch({ type: "CLOSE_EDIT_MODAL" })
      fetchBookings()
      toast.success("Booking updated successfully")
    } else {
      toast.error("Failed to update booking")
    }
  }, [selectedBooking, fetchBookings])

  if (isLoading && bookings.length === 0) return <span>Loading...</span>

  return (
    <div id="wrapper">
      <div id="tile">
        <h1>Manage asset bookings</h1>
      </div>

      <div id="operations">
        <div id="search-bar">
          <input
            type="text"
            placeholder="Search by customer"
            onChange={handleChange}
            value={params.name}
            name="name"
          />
          <select
            name="returned_status"
            onChange={handleChange}
            value={params.returned_status}
          >
            <option value="All">All Return Status</option>
            <option value="pending">Pending</option>
            <option value="returned">Returned</option>
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
          Add Booking
        </button>
      </div>

      <Table
        headers={['Customer', 'Phone', 'Project', 'Rented Date', 'Returned Date', 'Total', 'Return Status', 'Payment Status', 'Action']}
        data={bookings}
        pagination={pagination}
        setPage={handleSetPage}
        renderRow={(booking) => (
          <tr key={booking._id}>
            <td>{booking?.customer_name}</td>
            <td>{booking?.phone_number}</td>
            <td>{booking?.project?.name || '—'}</td>
            <td>{new Date(booking?.rented_date).toLocaleDateString()}</td>
            <td>{booking?.returned_date ? new Date(booking?.returned_date).toLocaleDateString() : 'N/A'}</td>
            <td>{booking?.total_Amount}</td>
            <td>
              <span className={`status ${booking?.returned_status}`}>
                {booking?.returned_status}
              </span>
            </td>
            <td>
              <span className={`status ${booking?.payment_status}`}>
                {booking?.payment_status}
              </span>
            </td>
            <td>
              <ActionMenu
                onView={() => navigate(`/assets/rental/${booking._id}`)}
                onEdit={() => handleOpenEdit(booking)}
                onDelete={() => handleDelete(booking._id)}
              />
            </td>
          </tr>
        )}
      />

      <Modal isOpen={addModal} setIsOpen={() => dispatch({ type: 'CLOSE_ADD_MODAL' })}>
        <BookingForm
          data={{
            asset: '',
            project: '',
            customer_name: '',
            phone_number: '',
            total_Amount: '',
            rented_date: new Date().toISOString().split('T')[0],
            returned_date: '',
            returned_status: 'pending',
            payment_status: 'pending'
          }}
          handleBooking={addBooking}
        />
      </Modal>

      <Modal isOpen={editModal} setIsOpen={() => dispatch({ type: 'CLOSE_EDIT_MODAL' })}>
        {selectedBooking && (
          <BookingForm
            data={selectedBooking}
            handleBooking={editBooking}
          />
        )}
      </Modal>
    </div>
  )
}

export default ViewAssetsBooking