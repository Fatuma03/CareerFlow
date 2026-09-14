import './App.css'
import { useState, useEffect, type ChangeEvent, type SubmitEvent } from 'react'

type Application = {
  id: number
  company: string
  role: string
  status: string
  dateApplied: string
  jobUrl: string | null
  notes: string | null
  followUpDate: string |null
  location: string | null
}


type ApplicationCardProps={
  id: number
  company: string
  role: string
  status: string
  dateApplied: string
  jobUrl: string | null
  notes: string | null
  followUpDate: string | null
  location: string | null
  onDelete: (id: number)=> void
  onEdit:(id: number)=> void
}
function ApplicationCard({id, company, role, status, onDelete, onEdit, dateApplied, jobUrl, location, notes,followUpDate}: ApplicationCardProps){
  const isFollowUpDue =status!== 'Rejected' && status !== 'Withdrawn' && followUpDate!== null && followUpDate !== '' &&
   new Date(`${followUpDate}T00:00:00`)<= new Date()
  return(
    <div className='application-card'>
        <h1>{company}</h1>
        <p>{role}</p>
        <p>Status: <span className= {`status-badge ${status.toLowerCase()}`}>{status}</span></p>
        <p>Date Applied: {dateApplied}</p>
        {jobUrl && (
        <p>
            <a href={jobUrl} target="_blank" rel="noreferrer">View Job Posting</a>
        </p>)}
        {followUpDate && (<p>Follow-Up-Date: {followUpDate}</p>)}
        {location && (<p>Location: {location}</p>)}
        {notes && (<p>Notes: {notes}</p>)}
        {isFollowUpDue && (<p className='follow-up-warning'>⚠️ Follow-up Due</p>)}
        <button className='delete-button'  onClick={()=> onDelete(id)}> Delete</button>
        <button className='edit-button' onClick={()=> onEdit(id)}>Edit</button>
      </div>
  )
  
}

export default function App(){
  const [applications, setApplications] =useState<Application[]>([])
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    dateApplied: "",
    status: "Applied",
    jobUrl: "",
    notes: "",
    followUpDate: "",
    location: ""
  })
  const[editingId, setEditingId]= useState<number |null>(null)
  const[statusFilter, setStatusFilter]=useState("All")
  const[searchTerm, setSearchTerm]= useState("")
  const[sortOption, setSortOption]= useState("Newest")
  const[loading, setLoading]= useState(true)
  const[error, setError]= useState<string |null>(null)
  const[successMessage, setSuccessMessage]=useState<string|null>(null)

  async function handleLoadApplication() {
    try{
    const response = await fetch('http://localhost:8080/applications')
    if(!response.ok){
      setError("Could not load Applications" )
      setLoading(false)
    }
    const data = await response.json()
    setApplications(data)
    setLoading(false)
    
    }catch(error){
      setError("Could not connect to server")
      setLoading(false)
    }
  }

  useEffect(() =>{handleLoadApplication()},[])

  async function handleApplication(event: SubmitEvent<HTMLFormElement>){
    event.preventDefault()
    setError(null)
    const newApplication ={
    company: formData.company,
    role: formData.role,
    dateApplied: formData.dateApplied,
    jobUrl: formData.jobUrl,
    notes: formData.notes,
    followUpDate: formData.followUpDate,
    location: formData.location
    }
    try{
      if(editingId==null){
        const response = await fetch('http://localhost:8080/applications',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newApplication)
      })
      if(!response.ok){
        setError("Failed to save application")
        return
      }
      const savedApplication = await response.json()
      setApplications([...applications, savedApplication])
      setSuccessMessage("Application added successfully.")
      setTimeout(()=>{setSuccessMessage(null)},3000)
      setFormData({company:'', role:'', dateApplied:'',status:'Applied', jobUrl:'',notes:'',location:'',followUpDate:''})
    }else{
      const response = await fetch(`http://localhost:8080/applications/${editingId}`,{
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      if(!response.ok){
        setError("Failed to update the application")
        return
      }   
      const updatedApplication = await response.json()
      const updatedApplications = applications.map((application)=>{
        if(application.id== editingId){
          return updatedApplication
        }
        return application
      })
      setApplications(updatedApplications)
      setSuccessMessage("Application updated successfully")
      setTimeout(()=>{setSuccessMessage(null)},3000)
      setFormData({company:'', role:'', dateApplied:'', status:'Applied',jobUrl:'', notes:'',followUpDate:'',location:''})
      setEditingId(null)
     }
  }catch(error){
    setError('Could not coonect to server')
  }
  }

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>){
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    })
  }

  async function handleDelete(id: number){
    const confirmed = window.confirm("Are you sure you want to delete this Application?")
    if(!confirmed){
      return
    }
    setError(null)
    try{
    const response = await fetch(`http://localhost:8080/applications/${id}`,{
      method: 'DELETE'
    })
    if(!response.ok){
      setError('failed to delete application')
      return
    }
    setApplications(applications.filter((application)=> application.id != id))
    setSuccessMessage("Application deleted successfully")
    setTimeout(()=>{setSuccessMessage(null)},3000)
  }catch(error){
    setError("Could not connect to server")
  }
  }
  
  function handleEdit(id: number){
    const applicationToEdit = applications.find((application)=> application.id==id)
    if(!applicationToEdit){
      return
    }
    setFormData({
      company: applicationToEdit.company,
      role: applicationToEdit.role,
      dateApplied: applicationToEdit.dateApplied,
      status: applicationToEdit.status,
      jobUrl: applicationToEdit.jobUrl ?? '',
      notes: applicationToEdit.notes ?? '',
      followUpDate:applicationToEdit.followUpDate ?? '',
      location: applicationToEdit.location ?? ''
    })
    setEditingId(id)
    document.querySelector('.application-form')
    ?.scrollIntoView({
      behavior:'smooth',
      block: 'start'
    })
  }

  function handleCancel(){
    setFormData({
      company:'',
      role:'',
      dateApplied:'',
      status:'',
      jobUrl: '' ,
      notes: '' ,
      followUpDate:'' ,
      location:''
     })
    setEditingId(null)
  }

  const followUpsDue = applications.filter((application)=>
    {
      return(
        application.status !== 'Rejected' && application.status !== 'Withdrawn' &&
        application.followUpDate !== null && application.followUpDate !== "" && 
        new Date(`${application.followUpDate}T00:00:00`)<= new Date()
      )
    })

  const filteredApplications = statusFilter === "All"? applications
    : statusFilter === "FollowUpDue" ? followUpsDue
   : applications.filter((application)=>application.status==statusFilter)
  
  const searchApplications = filteredApplications.filter((application)=>{
    return(
      application.company.toLowerCase().includes(searchTerm.toLowerCase()) || application.role.toLowerCase().includes(searchTerm.toLowerCase())
    )
    })

    

    const sortedApplications = [...searchApplications]
    if(sortOption==="Newest"){
      sortedApplications.sort((a,b)=> b.id - a.id)
    }
    if(sortOption==="Oldest"){
      sortedApplications.sort((a,b)=> a.id - b.id)
    }
    if(sortOption==="CompanyAZ"){
      sortedApplications.sort((a,b)=> a.company.toLowerCase().localeCompare(b.company.toLowerCase()))
    }
    if(sortOption==="DateNewest"){
      sortedApplications.sort((a,b)=> 
      new Date(`${b.dateApplied}T00:00:00`).getTime() -
       new Date(`${a.dateApplied}T00:00:00`).getTime() 
      )
    }
    if(sortOption==="DateOldest"){
      sortedApplications.sort((a,b)=> 
      new Date(`${a.dateApplied}T00:00:00`).getTime() -
       new Date(`${b.dateApplied}T00:00:00`).getTime() 
      )
    }

    function formatDateForInput(date: Date){
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, "0")
      const day = String(date.getDate()).padStart(2, "0")
      return `${year}-${month}-${day}`
    }

    function handleDateApplied(event: ChangeEvent<HTMLInputElement>){
      const selectedDate = event.target.value 
      const followUp = new Date(`${selectedDate}T00:00:00`)
      followUp.setDate(followUp.getDate() + 14)
      setFormData({...formData,
        dateApplied: selectedDate,
        followUpDate: formatDateForInput(followUp)
      })
      
    }
    function handleClearFilters(){
      setStatusFilter("All")
      setSortOption("Newest")
      setSearchTerm("")
    }

  return(
    <div className='app'>
      <header className='app-header'>
        <h1>CareerFlow</h1>
        <p>Track your internship and job applications.</p>
      </header>
      
      <form className='application-form' onSubmit={handleApplication}>
      <label >Company
        <input type="text"
        name='company'
        value ={formData.company}
        onChange={handleChange}
        required
        />
      </label>
      <label >Role
        <input type="text"
        name= 'role'
        value ={formData.role}
        onChange={handleChange}
        required
        />
      </label>
      
      <label >Date-Applied
        <input type="date"
        name='dateApplied'
        value ={formData.dateApplied}
        onChange={handleDateApplied}
        required
        />
      </label>
      <label >Status
        <select 
        name= 'status'
        value ={formData.status}
        onChange={handleChange}
        required
        >
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
          <option value="Withdrawn">Withdrawn</option>

        </select>
      </label>
       
      <label >JobUrl
        <input type="url"
        name='jobUrl'
        value ={formData.jobUrl}
        onChange={handleChange}
        />
      </label>
      <label >Follow-Up-Date
        <input type="date"
        name= 'followUpDate'
        value ={formData.followUpDate}
        onChange={handleChange}
        />
      </label>
      <label >Location
        <input type="text"
        name= 'location'
        value ={formData.location}
        onChange={handleChange}
        />
      </label>
      
      <label > Notes
        <textarea 
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        ></textarea>
      </label>
      <button type='submit' className='primary-button'>{editingId===null?'Add Application': 'Save Changes'}</button>
      {editingId!==null && (<button className='secondary-button' type='button' onClick={handleCancel}>Cancel</button>)}
      </form>
      <section className='dashboard'>
      <p>Total Applications: {applications.length}</p>
      <p>Applied: {applications.filter((application)=> application.status === "Applied").length}</p>
      <p>Interview: {applications.filter((application)=> application.status === "Interview").length}</p>
      <p>Offer: {applications.filter((application)=> application.status === "Offer").length}</p>
      <p>Rejected: {applications.filter((application)=> application.status === "Rejected").length}</p>
      <p>Withdrawn: {applications.filter((application)=> application.status === "Withdrawn").length}</p>
      <p>Follow-ups-Due: {followUpsDue.length}</p>
      </section>
      <div className='toolbar'>
      <label> Filter-by-Status
        <select 
        value={statusFilter}
        onChange={(event)=> setStatusFilter(event.target.value)}
        >
          <option value="All">All</option>
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
          <option value="Withdrawn">Withdrawn</option>
          <option value="FollowUpDue">Follows-up-Due</option>
        </select>
      </label>

      <label>Search-bar 
        <input type="text"
        value={searchTerm}
        placeholder='search applications...'
        onChange={(event)=> setSearchTerm(event.target.value)}
        />
      </label>

      <label>
        Sort by
        <select 
          value={sortOption}
          onChange={(event)=> setSortOption(event.target.value)}
        >
          <option value="Newest">Newest</option>
          <option value="Oldest">Oldest</option>
          <option value="CompanyAZ">Company A-Z</option>
          <option value="DateNewest">Date-Newest</option>
          <option value="DateOldest">Date-Oldest</option>
        </select>
      </label>
      
      <button type='button' onClick={handleClearFilters}>Clear Filters</button>
      </div>
      {!loading && !error && searchApplications.length ===0 &&(<p className='empty-message'>No applications found.</p>)}
      {loading  && (<p className='loading-message'>Loading applications...</p>)}
      {error && (<p className='error-message'>{error}</p>)}
      {successMessage && (<p className='success-message'>{successMessage}</p>)}
      {sortedApplications.map((application) =>(
        <ApplicationCard
        key= {application.id}
        id={application.id}
        company={application.company}
        role={application.role}
        status={application.status}
        dateApplied={application.dateApplied}
        jobUrl= {application.jobUrl}
        followUpDate={application.followUpDate}
        location = {application.location}
        notes={application.notes}
        onDelete={handleDelete}
        onEdit={handleEdit}
        />
        
      ))}
    </div>
  )
}
