import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Grid, Button, Chip, Avatar, TextField, InputAdornment, IconButton } from '@mui/material';
import { Search, ThumbUp, Comment } from '@mui/icons-material';

const Blog: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

  const handleLike = (postId: number) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const blogPosts = [
    {
      id: 1,
      title: '10 Tips for Acing Your Next Job Interview',
      excerpt: 'Master the art of job interviews with these proven strategies that will help you stand out from other candidates.',
      author: 'Sarah Johnson',
      date: '2024-01-15',
      category: 'Interview Tips',
      readTime: '5 min read',

      featured: true
    },
    {
      id: 2,
      title: 'Remote Work: The Future of Employment',
      excerpt: 'Explore how remote work is reshaping the job market and what it means for both employers and job seekers.',
      author: 'Mike Chen',
      date: '2024-01-12',
      category: 'Future of Work',
      readTime: '8 min read',

      featured: true
    },
    {
      id: 3,
      title: 'Building a Standout Resume in 2024',
      excerpt: 'Learn the latest resume trends and techniques to make your application stand out in today\'s competitive job market.',
      author: 'Lisa Wang',
      date: '2024-01-10',
      category: 'Resume Tips',
      readTime: '6 min read',

      featured: false
    },
    {
      id: 4,
      title: 'Salary Negotiation: Getting What You Deserve',
      excerpt: 'Master the art of salary negotiation with these expert tips and strategies for maximizing your earning potential.',
      author: 'David Brown',
      date: '2024-01-08',
      category: 'Career Advice',
      readTime: '7 min read',

      featured: false
    },
    {
      id: 5,
      title: 'Tech Skills in High Demand for 2024',
      excerpt: 'Discover the most sought-after technical skills that employers are looking for in the current job market.',
      author: 'Emily Davis',
      date: '2024-01-05',
      category: 'Tech Trends',
      readTime: '4 min read',

      featured: false
    },
    {
      id: 6,
      title: 'Networking in the Digital Age',
      excerpt: 'Learn how to build meaningful professional connections online and leverage social media for career growth.',
      author: 'Alex Rodriguez',
      date: '2024-01-03',
      category: 'Networking',
      readTime: '6 min read',

      featured: false
    }
  ];

  const categories = ['All', 'Interview Tips', 'Career Advice', 'Resume Tips', 'Tech Trends', 'Future of Work', 'Networking'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

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
            align="center" 
            gutterBottom 
            sx={{ 
              fontWeight: 700, 
              color: 'white',
              mb: 2
            }}
          >
            Career Insights & Tips
          </Typography>
          <Typography 
            variant="h6" 
            align="center" 
            sx={{ 
              maxWidth: 800, 
              mx: 'auto', 
              mb: 3, 
              color: 'rgba(255,255,255,0.9)',
              fontWeight: 400
            }}
          >
            Stay ahead in your career with expert advice, industry insights, and practical tips from our team of career specialists.
          </Typography>
          
          <Box sx={{ maxWidth: 600, mx: 'auto' }}>
            <TextField
              fullWidth
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: 'white' }} />
                  </InputAdornment>
                ),
                sx: { 
                  bgcolor: 'rgba(255,255,255,0.1)', 
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                  '& input::placeholder': { color: 'rgba(255,255,255,0.7)' }
                }
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Categories */}
      <Box sx={{ py: 3, px: 3 }}>
        <Box display="flex" justifyContent="center" flexWrap="wrap" gap={1}>
          {categories.map((category) => (
            <Chip
              key={category}
              label={category}
              onClick={() => setSelectedCategory(category)}
              color={selectedCategory === category ? 'primary' : 'default'}
              variant={selectedCategory === category ? 'filled' : 'outlined'}
              sx={{ cursor: 'pointer' }}
            />
          ))}
        </Box>
      </Box>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <Box sx={{ py: 6, px: 3, position: 'relative', zIndex: 1 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 4, color: '#212121' }}>
            Featured Articles
          </Typography>
          <Grid container spacing={4}>
            {featuredPosts.map((post) => (
              <Grid item xs={12} md={6} key={post.id}>
                <Card className="card-hover-lift" sx={{ 
                  height: '100%',
                  backgroundColor: '#ffffff',
                  borderRadius: 3,
                  boxShadow: 3
                }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box display="flex" alignItems="center" gap={2} mb={3}>
                      <Typography sx={{ fontSize: '3rem' }}>
                        {post.image}
                      </Typography>
                      <Box>
                        <Chip label="Featured" color="primary" size="small" sx={{ mb: 1 }} />
                        <Typography variant="caption" sx={{ color: '#757575' }} display="block">
                          {post.category}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#212121' }}>
                      {post.title}
                    </Typography>
                    
                    <Typography variant="body1" sx={{ color: '#757575' }} paragraph>
                      {post.excerpt}
                    </Typography>
                    
                    <Box display="flex" alignItems="center" justifyContent="between" mt={3}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                          {post.author[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: '#212121' }}>
                            {post.author}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#757575' }}>
                            {new Date(post.date).toLocaleDateString()} • {post.readTime}
                          </Typography>
                        </Box>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        <IconButton 
                          size="small" 
                          onClick={() => handleLike(post.id)}
                          color={likedPosts.has(post.id) ? 'primary' : 'default'}
                        >
                          <ThumbUp fontSize="small" />
                        </IconButton>
                        <Typography variant="caption" sx={{ color: '#757575' }}>24</Typography>
                        <IconButton size="small">
                          <Comment fontSize="small" />
                        </IconButton>
                        <Typography variant="caption" sx={{ color: '#757575' }}>8</Typography>
                        <Button variant="outlined" size="small" sx={{ ml: 1 }}>
                          Read More
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Regular Posts */}
      <Box sx={{ py: 6, px: 3, position: 'relative', zIndex: 1 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 4, color: '#212121' }}>
          Latest Articles
        </Typography>
        <Grid container spacing={3}>
          {regularPosts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <Card className="card-hover-lift" sx={{ 
                height: '100%',
                backgroundColor: '#ffffff',
                borderRadius: 3,
                boxShadow: 2
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box textAlign="center" mb={2}>
                    <Typography sx={{ fontSize: '2.5rem' }}>
                      {post.image}
                    </Typography>
                  </Box>
                  
                  <Chip label={post.category} size="small" sx={{ mb: 2 }} />
                  
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#212121' }}>
                    {post.title}
                  </Typography>
                  
                  <Typography variant="body2" sx={{ color: '#757575' }} paragraph>
                    {post.excerpt}
                  </Typography>
                  
                  <Box display="flex" alignItems="center" justifyContent="between" mt={2}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#212121' }}>
                        {post.author}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#757575' }}>
                        {new Date(post.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <IconButton 
                        size="small" 
                        onClick={() => handleLike(post.id)}
                        color={likedPosts.has(post.id) ? 'primary' : 'default'}
                      >
                        <ThumbUp fontSize="small" />
                      </IconButton>
                      <Typography variant="caption" sx={{ color: '#757575' }}>15</Typography>
                      <Typography variant="caption" sx={{ color: '#1976d2', ml: 1 }}>
                        {post.readTime}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Newsletter Signup */}
      <Box sx={{ py: 8, textAlign: 'center', background: 'rgba(255,255,255,0.95)', position: 'relative', zIndex: 1 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'white' }}>
          Stay Updated
        </Typography>
        <Typography variant="h6" paragraph sx={{ maxWidth: 600, mx: 'auto', color: 'rgba(255,255,255,0.9)' }}>
          Subscribe to our newsletter and get the latest career tips and job market insights delivered to your inbox.
        </Typography>
        <Box sx={{ maxWidth: 400, mx: 'auto', display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            placeholder="Enter your email"
            InputProps={{
              sx: { 
                bgcolor: 'white',
                '& input': { color: '#212121' }
              }
            }}
          />
          <Button variant="contained" color="secondary" sx={{ minWidth: 'auto', px: 3 }}>
            Subscribe
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Blog;