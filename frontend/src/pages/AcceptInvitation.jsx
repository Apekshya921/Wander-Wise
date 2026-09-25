import React from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Button } from '../components/ui/button';
import api from '../api/axios';
import { toast } from 'sonner';

const AcceptInvitation = () => {
    const navigate=useNavigate()
    const id=useParams()
    const [searchParams]=useSearchParams();
    const token=searchParams.get('token');
    const accept=async()=>{
try{
    const response=await api.get(`/trip/${id}/invite/accept?token=${token}`)
    if(response.status===200){
        toast.success('Invitation Accepted')
        navigate("/trips")
    }
    else{
        toast.error('Failed to accept invitation')
    }
}
catch(error){
toast.error(error.message||'failed to accept invitation')
}
    }
  return (
    <div className='py-24 flex flex'>

      <Button onClick={accept}>Accept</Button>
    </div>
  )
}

export default AcceptInvitation
