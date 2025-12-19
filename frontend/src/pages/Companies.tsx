import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, TextField, InputAdornment, Button, Chip, Avatar, Pagination, CircularProgress, Alert } from '@mui/material';
import { Search, LocationOn } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { jobAPI } from '../services/api';

const Companies: React.FC = () => {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const companiesPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanies();
    
    // Real-time updates
    const handleJobCreated = () => fetchCompanies();
    window.addEventListener('jobCreated', handleJobCreated);
    
    // Auto-refresh every 10 seconds for real-time updates
    const interval = setInterval(fetchCompanies, 10000);
    
    return () => {
      window.removeEventListener('jobCreated', handleJobCreated);
      clearInterval(interval);
    };
  }, []);

  const fetchCompanies = async () => {
    try {
      const jobs = await jobAPI.getJobs();
      
      // Extract unique companies from jobs
      const companyMap = new Map();
      
      jobs.forEach((job: any) => {
        const companyName = job.companyName;
        if (companyName) {
          if (!companyMap.has(companyName)) {
            companyMap.set(companyName, {
              id: companyName,
              name: companyName,
              logo: companyName[0]?.toUpperCase() || 'C',
              location: job.location,
              openJobs: 1,
              jobs: [job]
            });
          } else {
            const company = companyMap.get(companyName);
            company.openJobs++;
            company.jobs.push(job);
          }
        }
      });
      
      setCompanies(Array.from(companyMap.values()));
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };



  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCompanies.length / companiesPerPage);
  const startIndex = (currentPage - 1) * companiesPerPage;
  const currentCompanies = filteredCompanies.slice(startIndex, startIndex + companiesPerPage);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Professional Header */}
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)',
          py: 4,
          mb: 4
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3 }}>
          <Typography 
            variant="h3" 
            gutterBottom 
            sx={{ 
              fontWeight: 700, 
              color: 'white', 
              textAlign: 'center',
              mb: 2
            }}
          >
            Top Companies Hiring
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'rgba(255,255,255,0.9)', 
              textAlign: 'center', 
              mb: 3,
              fontWeight: 400
            }}
          >
            {companies.length} companies with active job openings
          </Typography>
          
          <Box sx={{ maxWidth: 600, mx: 'auto' }}>
            <TextField
              fullWidth
              placeholder="Search companies..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: 'white' }} />
                  </InputAdornment>
                ),
                sx: { 
                  bgcolor: 'rgba(255,255,255,0.1)', 
                  color: 'white', 
                  '& .MuiOutlinedInput-notchedOutline': { 
                    borderColor: 'rgba(255,255,255,0.3)' 
                  }
                }
              }}
            />
          </Box>
        </Box>
      </Box>

      {loading ? (
        <Box display="flex" flexDirection="column" alignItems="center" py={8}>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography sx={{ fontWeight: 600 }}>Loading companies...</Typography>
        </Box>
      ) : companies.length === 0 ? (
        <Alert severity="info" sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
          No companies found. Companies will appear here when jobs are posted.
        </Alert>
      ) : (
        <>
          <Box sx={{ mb: 4, px: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, textAlign: 'center' }}>
              Showing {startIndex + 1}-{Math.min(startIndex + companiesPerPage, filteredCompanies.length)} of {filteredCompanies.length} companies
            </Typography>
          </Box>

          <Grid container spacing={3} sx={{ px: 3 }}>
            {currentCompanies.map((company) => (
              <Grid item xs={12} md={6} key={company.id}>
                <Card sx={{ 
                  height: '100%',
                  backgroundColor: '#ffffff',
                  borderRadius: 3,
                  boxShadow: 3,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px 0 rgb(0 0 0 / 0.1)'
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" alignItems="center" gap={2} mb={3}>
                      <Avatar sx={{ width: 60, height: 60, fontSize: '1.5rem', bgcolor: 'primary.main' }}>
                        {company.logo}
                      </Avatar>
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 600, color: '#212121' }}>
                          {company.name}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
                          <LocationOn fontSize="small" sx={{ color: '#757575' }} />
                          <Typography variant="body2" sx={{ color: '#757575' }}>
                            {company.location}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Typography variant="body2" sx={{ color: '#757575', mb: 3 }}>
                      Currently hiring for {company.openJobs} position{company.openJobs > 1 ? 's' : ''}
                    </Typography>

                    <Box mb={3}>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                        Recent Openings:
                      </Typography>
                      {company.jobs.slice(0, 3).map((job: any, idx: number) => (
                        <Chip 
                          key={idx}
                          label={job.title} 
                          size="small" 
                          sx={{ mr: 1, mb: 1 }}
                          variant="outlined"
                        />
                      ))}
                    </Box>

                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Chip 
                        label={`${company.openJobs} Open Job${company.openJobs > 1 ? 's' : ''}`} 
                        color="primary" 
                        variant="filled"
                      />
                      <Button 
                        variant="contained" 
                        size="small"
                        onClick={() => navigate(`/jobs?company=${encodeURIComponent(company.name)}`)}
                      >
                        View Jobs
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" sx={{ mt: 4, pb: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Box>
  );
};

export default Companies;