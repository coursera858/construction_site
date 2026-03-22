
import { useCallback, useEffect, useReducer } from "react"
import Table from "../../components/shared/Table"
import { getRequest } from "../../api/api"

const initialState = {
  transactions: [],
  isLoading: true,
  pagination: null,
  params: { page: 1, name: '', type: 'All', category: 'All', payment_type: 'All' },
}

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_TRANSACTIONS":
      return {
        ...state,
        transactions: action.payload.transactions,
        pagination: action.payload.pagination
      }

    case "SET_LOADING":
      return { ...state, isLoading: action.payload }

    case "SET_PARAMS":
      return {
        ...state,
        params: { ...state.params, ...action.payload }
      }

    default:
      return state
  }
}

const ViewProjectPayments = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { transactions, isLoading, pagination, params } = state

  const fetchTransactions = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true })
    const response = await getRequest(
      `/project/transactions?name=${encodeURIComponent(params.name)}&type=${params.type}&category=${params.category}&payment_type=${params.payment_type}&page=${params.page}`
    )
    if (response.success) {
      dispatch({
        type: "SET_TRANSACTIONS",
        payload: {
          transactions: response.data.transactions,
          pagination: response.data.pagination
        }
      })
    }
    dispatch({ type: "SET_LOADING", payload: false })
  }, [params])

  useEffect(() => {
    const timer = setTimeout(fetchTransactions, 500)
    return () => clearTimeout(timer)
  }, [fetchTransactions])

  const handleChange = (e) => {
    dispatch({
      type: "SET_PARAMS",
      payload: { [e.target.name]: e.target.value, page: 1 }
    })
  }

  const handleSetPage = useCallback((updater) => {
    dispatch({ type: 'SET_PARAMS', payload: updater })
  }, [])

  if (isLoading && transactions.length === 0) return <span>Loading...</span>

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0)
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0)
  const profit = totalIncome - totalExpense

  return (
    <div id="wrapper">
      <div id="tile">
        <h1>Project Transaction History</h1>
      </div>

      <div id="operations">
        <div id="search-bar">
          <input
            type="text"
            placeholder="Search by project or client"
            name="name"
            value={params.name}
            onChange={handleChange}
          />
          <select
            name="type"
            onChange={handleChange}
            value={params.type}
          >
            <option value="All">All Types</option>
            <option value="income">Income (Payments)</option>
            <option value="expense">Expenses</option>
          </select>
          <select
            name="category"
            onChange={handleChange}
            value={params.category}
          >
            <option value="All">All Categories</option>
            <option value="client payment">Client Payment</option>
            <option value="labour">Labour</option>
            <option value="material">Material</option>
            <option value="transport">Transport</option>
          </select>
          <select
            name="payment_type"
            onChange={handleChange}
            value={params.payment_type}
          >
            <option value="All">All Modes</option>
            <option value="cash">Cash</option>
            <option value="cheque">Cheque</option>
            <option value="phonepay">PhonePe</option>
          </select>
        </div>
      </div>

      <Table
        headers={['Date', 'Project', 'Client', 'Type', 'Category', 'Amount', 'Mode']}
        data={transactions}
        pagination={pagination}
        setPage={handleSetPage}
        renderRow={(tx) => (
          <tr key={tx._id}>
            <td>{new Date(tx.date).toLocaleDateString()}</td>
            <td>{tx.project?.name || 'N/A'}</td>
            <td>{tx.project?.client_name || 'N/A'}</td>
            <td>
              <span className={`status ${tx.type}`}>
                {tx.type === 'income' ? 'Income' : 'Expense'}
              </span>
            </td>
            <td>{tx.category}</td>
            <td className={`amount ${tx.type}`}>
              ₹{tx.amount}
            </td>
            <td>{tx.payment_type}</td>
          </tr>
        )}
      />
    </div>
  )
}

export default ViewProjectPayments