import { useState } from 'react'
import { Search, MapPin, Briefcase, DollarSign, Clock, ExternalLink, Filter } from 'lucide-react'
import { Card, Button, Input, Badge } from '../components/UI'

export default function Jobs() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')

  const jobListings = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'Tech Startup Indonesia',
      location: 'Jakarta (Hybrid)',
      type: 'Full-time',
      salary: 'Rp 15-25 Juta',
      posted: '2 jam lalu',
      tags: ['React', 'TypeScript', 'Tailwind'],
      featured: true,
    },
    {
      id: 2,
      title: 'Full Stack Engineer',
      company: 'E-commerce Unicorn',
      location: 'Remote',
      type: 'Full-time',
      salary: 'Rp 20-35 Juta',
      posted: '5 jam lalu',
      tags: ['Node.js', 'React', 'PostgreSQL'],
      featured: true,
    },
    {
      id: 3,
      title: 'Backend Developer',
      company: 'FinTech Corporation',
      location: 'Bandung',
      type: 'Full-time',
      salary: 'Rp 12-20 Juta',
      posted: '1 hari lalu',
      tags: ['Python', 'FastAPI', 'AWS'],
      featured: false,
    },
    {
      id: 4,
      title: 'DevOps Engineer',
      company: 'Cloud Solutions Ltd',
      location: 'Surabaya',
      type: 'Full-time',
      salary: 'Rp 18-28 Juta',
      posted: '1 hari lalu',
      tags: ['Kubernetes', 'Docker', 'CI/CD'],
      featured: false,
    },
    {
      id: 5,
      title: 'Product Designer',
      company: 'Design Agency',
      location: 'Jakarta',
      type: 'Contract',
      salary: 'Rp 10-18 Juta',
      posted: '2 hari lalu',
      tags: ['Figma', 'UI/UX', 'Prototyping'],
      featured: false,
    },
    {
      id: 6,
      title: 'Data Scientist',
      company: 'AI Research Lab',
      location: 'Remote',
      type: 'Full-time',
      salary: 'Rp 25-40 Juta',
      posted: '3 hari lalu',
      tags: ['Python', 'Machine Learning', 'TensorFlow'],
      featured: true,
    },
  ]

  const filters = [
    { id: 'all', label: 'Semua' },
    { id: 'remote', label: 'Remote' },
    { id: 'fulltime', label: 'Full-time' },
    { id: 'contract', label: 'Contract' },
  ]

  const filteredJobs = jobListings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (selectedFilter === 'all') return matchesSearch
    if (selectedFilter === 'remote') return matchesSearch && job.location.toLowerCase().includes('remote')
    if (selectedFilter === 'fulltime') return matchesSearch && job.type === 'Full-time'
    if (selectedFilter === 'contract') return matchesSearch && job.type === 'Contract'
    
    return matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Search</h1>
        <p className="text-gray-600">Temukan lowongan pekerjaan yang sesuai dengan skill Anda</p>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="space-y-4">
          <Input
            placeholder="Cari posisi atau perusahaan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedFilter === filter.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Job Stats */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Menampilkan <span className="font-semibold">{filteredJobs.length}</span> dari{' '}
          <span className="font-semibold">{jobListings.length}</span> lowongan
        </p>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Filter Lanjutan
        </Button>
      </div>

      {/* Job Listings */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <Card
            key={job.id}
            className={`p-6 hover:shadow-md transition-shadow ${
              job.featured ? 'border-2 border-primary-200 bg-primary-50' : ''
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                    <p className="text-gray-600">{job.company}</p>
                  </div>
                  {job.featured && (
                    <Badge variant="primary">Featured</Badge>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {job.location}
                  </span>
                  <span className="flex items-center">
                    <Briefcase className="w-4 h-4 mr-1" />
                    {job.type}
                  </span>
                  <span className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    {job.salary}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {job.posted}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {job.tags.map((tag, index) => (
                    <Badge key={index} variant="default">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex md:flex-col gap-2">
                <Button className="flex-1 md:flex-none">
                  Lamar Sekarang
                </Button>
                <Button variant="outline" size="sm" className="flex-1 md:flex-none">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Load More */}
      {filteredJobs.length > 0 && (
        <div className="text-center pt-4">
          <Button variant="outline" size="lg">
            Muat Lebih Banyak Lowongan
          </Button>
        </div>
      )}

      {/* Empty State */}
      {filteredJobs.length === 0 && (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Tidak ada lowongan ditemukan
            </h3>
            <p className="text-gray-600 mb-6">
              Coba ubah kata kunci pencarian atau filter Anda
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('')
                setSelectedFilter('all')
              }}
            >
              Reset Pencarian
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}