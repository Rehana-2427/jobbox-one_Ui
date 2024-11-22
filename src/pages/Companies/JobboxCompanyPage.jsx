import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import Pagination from "../../Pagination";
import CustomNavbar from "../CustomNavbar";
import HomeFooter from "../HomeFooter";

const JobboxCompanyPage = () => {
  const BASE_API_URL = process.env.REACT_APP_API_URL;
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(0);
  const [companyType, setCompanyType] = useState('');
  const [industryType, setIndustryType] = useState('');
  const [location, setLocation] = useState('');
  const [companyTypes, setCompanyTypes] = useState([]);
  const [industryTypes, setIndustryTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const navigate = useNavigate();

  const handlePageClick = (data) => {
    const selectedPage = Math.max(0, Math.min(data.selected, totalPages - 1));
    setPage(selectedPage);
    localStorage.setItem('currentCompanyPage', selectedPage);
  };


  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const companyTypesResponse = await axios.get(`${BASE_API_URL}/companyTypes`);
        setCompanyTypes(companyTypesResponse.data);

        const industryTypesResponse = await axios.get(`${BASE_API_URL}/industryTypes`);
        setIndustryTypes(industryTypesResponse.data);

        const locationsResponse = await axios.get(`${BASE_API_URL}/locations`);
        setLocations(locationsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Optionally, you can set an error state to display an error message to the user
      }
    };

    fetchFilterData();
  }, []);

  const handleCompanyTypeChange = (e) => {
    const value = e.target.value;
    if (value === 'all') {
      setCompanyType(''); // or whatever the default value you want
    } else {
      setCompanyType(value);
    }
    localStorage.setItem('currentCompanyPage', 0);
  };

  const handleIndustryTypeChange = (e) => {
    const value = e.target.value;
    if (value === 'all') {
      setIndustryType(''); // or whatever the default value you want
    } else {
      setIndustryType(value);
    }
    localStorage.setItem('currentCompanyPage', 0);
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
    localStorage.setItem('currentCompanyPage', 0);
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        let url;

        if (search) {
          url = `${BASE_API_URL}/searchCompany`;
        } else if (companyType || industryType || location) { // Assuming companyType is the new condition
          url = `${BASE_API_URL}/companiesByType`;
        } else {
          url = `${BASE_API_URL}/companiesList`;
        }


        const params = {
          search,
          page,
          size: pageSize,
          companyType,
          industryType,
          location
        };

        console.log("Fetching data with params:", params);

        const storedPage = localStorage.getItem('currentCompanyPage');
        const storedPageSize = localStorage.getItem('currentCompanyPageSize');

        if (storedPage) {
          params.page = Number(storedPage);
          setPage(Number(storedPage));
        }

        if (storedPageSize) {
          params.size = Number(storedPageSize);
          setPageSize(Number(storedPageSize));
        }

        const response = await axios.get(url, { params });
        if (response.data.content.length === 0) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Company not found!"
          });
          setSearch('');
          setLocation('');
        }
        setCompanies(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.log("Error fetching data: " + error);
      }
    };
    fetchData();
  }, [search, page, pageSize, companyType, industryType, location]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    localStorage.setItem('currentCompanyPage', 0);
  };

  const handlePageSizeChange = (e) => {
    const size = parseInt(e.target.value, 10);
    // localStorage.setItem('currentCompanyPageSize', size);
    setPageSize(size);
    setPage(0);
  };

  const handleClick = (companyId) => {
    navigate("/jobboxCompanyPage/eachCompanyPage", { state: { companyId } });
  };

  const isLastPage = page === totalPages - 1;
  const isPageSizeDisabled = isLastPage;

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navLinkStyle = screenWidth > 990 ? { marginRight: '40px', marginLeft: '150px' } : {};

  return (
    <div className="top-right-content">
      <CustomNavbar />

      <div className="companyJob" style={{ marginTop: '100px' }}>

        <div >

          <div className="d-flex flex-column justify-content-between">
            {/* Filter Options Section */}
            <h3 style={{paddingTop:'20px'}}>Filter Options</h3>
            <div className="filter-section d-flex flex-row justify-content-between" style={{ maxWidth: '100%', backgroundColor: '#f4f4f9', marginLeft: '24px', marginRight: '24px' }}>
              {/* Filter by Company Type */}
              <div className="filter mb-3 filter-select-company-type" style={{width:'300px'}}>
                <label htmlFor="companyType" className="form-label" style={{ color: '#6c5b7b', fontWeight: 'bold' }}>
                  Select Company Type:
                </label>
                <select id="companyType" className="form-select form-select-sm fs-6" style={{ borderColor: '#6c5b7b', borderRadius: '5px', padding: '8px' }} value={companyType} onChange={handleCompanyTypeChange}>
                  <option value='all'>All</option>
                  {companyTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Filter by Industry */}
              <div className="filter mb-3">
                <label htmlFor="industryType" className="form-label" style={{ color: '#6c5b7b', fontWeight: 'bold' }}>
                  Select Industry:
                </label>
                <select id="industryType" className="form-select form-select-sm fs-6" style={{ borderColor: '#6c5b7b', borderRadius: '5px', padding: '8px' }} value={industryType} onChange={handleIndustryTypeChange}>
                  <option value='all'>All</option>
                  {industryTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Filter by Location */}
              <div className="filter mb-3">
                <label htmlFor="location" className="form-label" style={{ color: '#6c5b7b', fontWeight: 'bold' }}>
                 Search Location:
                </label>
                <input
                  type="text"
                  id="location"
                  style={{ height: '45px', borderRadius: '5px', width: '100%', border: '1px solid #ccc', padding: '8px' }}
                  placeholder="Enter location"
                  value={location}
                  onChange={handleLocationChange}
                />
              </div>

              {/* Search Input */}
              <div className="filter mb-3">
                <label htmlFor="search" className="form-label" style={{ color: '#6c5b7b', fontWeight: 'bold' }}>
                  Search Company:
                </label>
                <input
                  style={{ height: '45px', borderRadius: '5px', width: '100%', border: '1px solid #ccc', padding: '8px' }}
                  type="text"
                  name="search"
                  id="search"
                  placeholder="Search Company By Name"
                  value={search}
                  onChange={handleSearchChange}
                />
              </div>
            </div>

            {/* Company Cards Section */}
            <div className="cards flex-grow-1 d-flex flex-wrap justify-content-start" style={{ minHeight: 'fit-content', width: '100%', marginLeft: '45px' }}>
              {companies.length > 0 ? (
                companies.map((company) => (
                  <Card className="company-card-job" key={company.companyId} style={{ width: '100%', flex: '1 0 400px', margin: '12px' }}>
                    <Card.Body>
                      <Card.Title>Company Name: <b>{company.companyName}</b></Card.Title>
                      <Card.Text>Industry: <b>{company.industryService}</b></Card.Text>
                      <Button onClick={() => handleClick(company.companyId)}>
                        View
                      </Button>
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <div className="d-flex justify-content-center mt-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {companies.length > 0 && (
          <Pagination
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
            handlePageSizeChange={handlePageSizeChange}
            isPageSizeDisabled={isPageSizeDisabled}
            handlePageClick={handlePageClick}
          />
        )}


      </div>
      <div >
        <HomeFooter />
      </div>
    </div>
  );
};

export default JobboxCompanyPage;
