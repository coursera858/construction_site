import { useCallback, useEffect, useReducer, useState } from "react"
import { useParams } from "react-router-dom"
import Table from "../../components/shared/Table"
import ActionMenu from "../../components/shared/ActionMenu"
import { getRequest, patchRequest, postRequest, deleteRequest } from "../../api/api"
import Modal from "../../components/shared/Modal"
import ProjectTransactionForm from "../../forms/Projects/ProjectTransactionForm"
import toast from "react-hot-toast"
import { MdCallReceived, MdCallMade, MdTrendingUp, MdTrendingDown, MdOutlineAccountBalance } from "react-icons/md"

const initialState = {
  project: null,
  transactions: [],
  isLoading: true,
  addModal: false,
  editModal: false,
  selectedTransaction: null,
}

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_DATA":
      return { ...state, project: action.payload.project, transactions: action.payload.transactions }
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }
    case "OPEN_ADD_MODAL":
      return { ...state, addModal: true }
    case "CLOSE_ADD_MODAL":
      return { ...state, addModal: false }
    case "OPEN_EDIT_MODAL":
      return { ...state, editModal: true, selectedTransaction: action.payload }
    case "CLOSE_EDIT_MODAL":
      return { ...state, editModal: false, selectedTransaction: null }
    default:
      return state
  }
}

// ── Category bar chart ────────────────────────────────────────────────────
const CategoryChart = ({ transactions }) => {
  const categories = {}
  transactions.forEach(t => {
    categories[t.category] = (categories[t.category] || 0) + t.amount
  })
  const entries = Object.entries(categories).sort((a, b) => b[1] - a[1])
  const max = Math.max(...entries.map(e => e[1]), 1)

  if (entries.length === 0) {
    return <p style={{ color: 'var(--muted-text)', fontSize: '0.85rem', textAlign: 'center', padding: '24px 0' }}>No transactions yet</p>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {entries.map(([cat, amt]) => (
        <div key={cat}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--dark-text)', textTransform: 'capitalize' }}>{cat}</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--dark-text)' }}>₹{amt.toLocaleString()}</span>
          </div>
          <div style={{ background: 'var(--light-grey)', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${(amt / max) * 100}%`,
              background: 'var(--accent)',
              borderRadius: '4px',
              transition: 'width 0.4s ease',
            }} />
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Stat tile ─────────────────────────────────────────────────────────────
const StatTile = ({ icon, label, value, variant = 'neutral' }) => {
  const colors = {
    neutral: { bg: 'var(--white)', border: 'var(--grey)', icon: 'var(--muted-text)', text: 'var(--dark-text)' },
    income:  { bg: 'var(--green-soft)', border: '#bbf7d0', icon: 'var(--green)', text: 'var(--green)' },
    expense: { bg: 'var(--red-soft)', border: '#fecaca', icon: 'var(--red)', text: 'var(--red)' },
    warning: { bg: '#fffbeb', border: '#fde68a', icon: 'var(--amber)', text: 'var(--amber)' },
  }
  const c = colors[variant]
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '14px',
      padding: '16px 20px', borderRadius: 'var(--radius)',
      border: `1px solid ${c.border}`, background: c.bg,
    }}>
      <div style={{
        width: '40px', height: '40px', borderRadius: 'var(--radius)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.2rem', color: c.icon, flexShrink: 0,
        background: 'rgba(0,0,0,0.04)',
      }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--muted-text)', marginBottom: '2px' }}>{label}</p>
        <p style={{ fontSize: '1.25rem', fontWeight: 700, color: c.text }}>{value}</p>
      </div>
    </div>
  )
}

// ── Detail row ────────────────────────────────────────────────────────────
const DetailRow = ({ label, value }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
    <span style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--muted-text)' }}>{label}</span>
    <span style={{ fontSize: '0.88rem', color: 'var(--dark-text)', fontWeight: 500 }}>{value}</span>
  </div>
)

// ── Main component ─────────────────────────────────────────────────────────
const ViewProjectDetails = () => {
  const { id } = useParams()
  const [state, dispatch] = useReducer(reducer, initialState)
  const { project, transactions, isLoading, addModal, editModal, selectedTransaction } = state
  const [typeFilter, setTypeFilter] = useState('All')

  const fetchDetails = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true })
    const response = await getRequest(`/project/${id}/transaction/`)
    if (response.success) {
      dispatch({ type: "SET_DATA", payload: { project: response.data.project, transactions: response.data.transactions } })
    }
    dispatch({ type: "SET_LOADING", payload: false })
  }, [id])

  useEffect(() => { fetchDetails() }, [fetchDetails])

  const handleAddTransaction = useCallback(async (data) => {
    const response = await postRequest(`/project/${id}/transaction/`, data)
    if (response.success) { dispatch({ type: "CLOSE_ADD_MODAL" }); fetchDetails(); toast.success("Transaction added") }
    else toast.error("Failed to add transaction")
  }, [id, fetchDetails])

  const handleEditTransaction = useCallback(async (data) => {
    const response = await patchRequest(`/project/${id}/transaction/${selectedTransaction._id}`, data)
    if (response.success) { dispatch({ type: "CLOSE_EDIT_MODAL" }); fetchDetails(); toast.success("Transaction updated") }
    else toast.error("Failed to update transaction")
  }, [id, selectedTransaction, fetchDetails])

  const handleDeleteTransaction = useCallback(async (transactionId) => {
    const response = await deleteRequest(`/project/${id}/transaction/${transactionId}`)
    if (response.success) { fetchDetails(); toast.success("Transaction deleted") }
    else toast.error("Failed to delete transaction")
  }, [id, fetchDetails])

  if (isLoading && !project) return <span>Loading...</span>

  const totalIncome  = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0)
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0)
  const netBalance   = totalIncome - totalExpense

  const filteredTx = typeFilter === 'All' ? transactions : transactions.filter(t => t.type === typeFilter)

  return (
    <div id="wrapper">
      <div id="tile">
        <h1>Project Details</h1>
      </div>

      {/* ── Stat Tiles ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', paddingBottom: '24px' }}>
        <StatTile icon={<MdCallReceived />}   label="Total Income"  value={`₹${totalIncome.toLocaleString()}`}              variant="income" />
        <StatTile icon={<MdCallMade />}       label="Total Expense" value={`₹${totalExpense.toLocaleString()}`}             variant="expense" />
        <StatTile
          icon={netBalance >= 0 ? <MdTrendingUp /> : <MdTrendingDown />}
          label={netBalance >= 0 ? 'Profit' : 'Loss'}
          value={`₹${Math.abs(netBalance).toLocaleString()}`}
          variant={netBalance >= 0 ? 'income' : 'expense'}
        />
        <StatTile icon={<MdOutlineAccountBalance />} label="Balance Due" value={`₹${Math.max(0, totalExpense - totalIncome).toLocaleString()}`} variant="warning" />
      </div>

      {/* ── Project Info + Category Chart ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div className="details-section">
          <h2>Project Information</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <DetailRow label="Project Name" value={project?.name} />
            <DetailRow label="Client Name" value={project?.client_name} />
            <DetailRow label="Phone" value={project?.phone_number} />
            <DetailRow label="Address" value={project?.address || 'N/A'} />
            <DetailRow label="Work Status"    value={<span className={`status ${project?.work_status}`}>{project?.work_status?.replace('_', ' ')}</span>} />
            <DetailRow label="Payment Status" value={<span className={`status ${project?.payment_status}`}>{project?.payment_status}</span>} />
          </div>
        </div>

        <div className="details-section">
          <h2>Spending by Category</h2>
          <CategoryChart transactions={transactions} />
        </div>
      </div>

      {/* ── Toolbar: filter pills + add button ── */}
      <div className="table-toolbar">
        <div className="filter-pills">
          {['All', 'income', 'expense'].map(f => (
            <button
              key={f}
              className={`pill-btn ${typeFilter === f ? 'active' : ''}`}
              onClick={() => setTypeFilter(f)}
            >
              {f === 'All' ? 'All' : f === 'income' ? 'Payments' : 'Expenses'}
            </button>
          ))}
        </div>
        <button className="add-btn" onClick={() => dispatch({ type: "OPEN_ADD_MODAL" })}>
          Add Transaction
        </button>
      </div>

      <Table
        headers={['Date', 'Type', 'Category', 'Amount', 'Mode', 'Description', 'Action']}
        data={filteredTx}
        renderRow={(tx) => (
          <tr key={tx._id}>
            <td>{new Date(tx.date).toLocaleDateString()}</td>
            <td><span className={`status ${tx.type}`}>{tx.type === 'income' ? 'Income' : 'Expense'}</span></td>
            <td style={{ textTransform: 'capitalize' }}>{tx.category}</td>
            <td className={`amount ${tx.type}`}>₹{tx.amount.toLocaleString()}</td>
            <td style={{ textTransform: 'capitalize' }}>{tx.payment_type}</td>
            <td style={{ color: 'var(--muted-text)' }}>{tx.description || '—'}</td>
            <td>
              <ActionMenu
                onEdit={() => dispatch({ type: 'OPEN_EDIT_MODAL', payload: tx })}
                onDelete={() => handleDeleteTransaction(tx._id)}
              />
            </td>
          </tr>
        )}
      />

      <Modal isOpen={addModal} setIsOpen={() => dispatch({ type: 'CLOSE_ADD_MODAL' })}>
        <ProjectTransactionForm
          data={{ type: 'income', category: 'client payment', amount: '', date: new Date().toISOString().split('T')[0], payment_type: 'cash', description: '' }}
          handleTransaction={handleAddTransaction}
        />
      </Modal>

      <Modal isOpen={editModal} setIsOpen={() => dispatch({ type: 'CLOSE_EDIT_MODAL' })}>
        {selectedTransaction && (
          <ProjectTransactionForm data={selectedTransaction} handleTransaction={handleEditTransaction} />
        )}
      </Modal>
    </div>
  )
}

export default ViewProjectDetails