import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from '../../utils/toast';
import Sidebar from '../common/Sidebar';

const DoctorProfile = () => {
  const navigate = useNavigate();
  const [doctor, setDoctor]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [form, setForm]       = useState({});

  useEffect(() => { fetchProfile(); }, []); // eslint-disable-line

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res   = await axios.get('/api/doctor/profile/me', { headers:{ Authorization:`Bearer ${token}` } });
      if (res.data.success) { setDoctor(res.data.data); setForm(res.data.data); }
    } catch { toast.error('Failed to load profile'); }
    finally   { setLoading(false); }
  };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res   = await axios.put('/api/doctor/profile/update', form, { headers:{ Authorization:`Bearer ${token}` } });
      if (res.data.success) { toast.success('Profile updated!'); setDoctor(res.data.data); }
    } catch { toast.error('Update failed'); }
    finally   { setSaving(false); }
  };

  const field = (name, label, type='text', placeholder='') => (
    <div className="form-group-3d">
      <label className="label-3d">{label}</label>
      <input className="input-3d" type={type} value={form[name]||''} placeholder={placeholder}
        onChange={e => setForm({...form,[name]:e.target.value})} />
    </div>
  );

  return (
    <div className="dashboard-layout">
      <Sidebar role="doctor" />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div className="dashboard-greeting">Doctor Profile</div>
          <div className="dashboard-subline">Update your professional information</div>
        </div>

        {loading ? <div className="loading-center"><div className="spinner-3d" /></div> : (
          <div style={{ display:'grid', gridTemplateColumns:'260px 1fr', gap:'1.5rem', alignItems:'start' }}>
            {/* Preview card */}
            <div className="glass-card" style={{ padding:'2rem', textAlign:'center', position:'sticky', top:'5rem' }}>
              <div style={{ width:72, height:72, borderRadius:18, margin:'0 auto 1rem', background:'linear-gradient(135deg,var(--primary),var(--accent))', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Syne,sans-serif', fontWeight:700, color:'#fff', fontSize:'1.6rem', boxShadow:'0 8px 28px rgba(14,165,233,0.35)' }}>
                {(doctor?.fullname||'').split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}
              </div>
              <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'1rem', color:'var(--text-primary)' }}>Dr. {form.fullname||''}</div>
              <div style={{ fontSize:'0.75rem', color:'var(--primary)', textTransform:'uppercase', letterSpacing:'0.06em', margin:'0.3rem 0 1rem' }}>{form.specialization||''}</div>
              <span className={`badge-3d ${doctor?.status==='approved'?'badge-approved':doctor?.status==='rejected'?'badge-rejected':'badge-pending'}`}>
                {doctor?.status||'pending'}
              </span>
              <div style={{ marginTop:'1.2rem', display:'flex', flexDirection:'column', gap:'0.5rem' }}>
                {[['📍',form.address],['🕐',form.timings],['💰',`₹${form.fees||0}`],['🏆',`${form.experience||0} yrs`]].map(([ic,val])=>val&&(
                  <div key={ic} style={{ fontSize:'0.8rem', color:'var(--text-secondary)', display:'flex', gap:'0.5rem', alignItems:'center' }}>
                    <span>{ic}</span><span>{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="glass-card" style={{ padding:'2rem' }}>
              <form onSubmit={handleSave}>
                <h3 style={{ fontFamily:'Syne,sans-serif', fontSize:'0.95rem', fontWeight:700, color:'var(--text-primary)', marginBottom:'1.3rem' }}>👤 Personal Details</h3>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                  {field('fullname','Full Name','text','Dr. John Smith')}
                  {field('phone','Phone','tel','+91 98765 43210')}
                  {field('email','Email','email','doctor@hospital.com')}
                  {field('address','Address','text','City, State')}
                </div>

                <div style={{ borderTop:'1px solid var(--border)', margin:'1.4rem 0' }} />
                <h3 style={{ fontFamily:'Syne,sans-serif', fontSize:'0.95rem', fontWeight:700, color:'var(--text-primary)', marginBottom:'1.3rem' }}>🩺 Professional Details</h3>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'1rem' }}>
                  {field('specialization','Specialization','text','Cardiology')}
                  {field('experience','Experience (yrs)','number','5')}
                  {field('fees','Consultation Fee (₹)','number','500')}
                </div>
                {field('timings','Available Timings','text','09:00 - 17:00')}

                <div style={{ display:'flex', justifyContent:'flex-end', gap:'1rem', marginTop:'1rem' }}>
                  <button type="button" className="btn-3d btn-secondary-3d" onClick={() => navigate('/doctor/dashboard')}>Cancel</button>
                  <button type="submit" className="btn-3d btn-primary-3d" disabled={saving} style={{ padding:'0.75rem 2rem' }}>
                    {saving ? <><span className="spinner-3d" style={{width:14,height:14,borderWidth:2}} /> Saving…</> : '✓ Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DoctorProfile;
