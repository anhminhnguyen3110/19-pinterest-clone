import React, { useState, useEffect } from 'react'
import { FaSearch } from 'react-icons/fa'
import Photo from './Photo'
const clientID = `?client_id=${process.env.REACT_APP_API_KEY}`
const mainUrl = `https://api.unsplash.com/photos/`
const searchUrl = `https://api.unsplash.com/search/photos/`

function App() {
  const [inp, setInp] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState(1);
  const [apifalse, setApifalse] = useState(false);
  const [sub, Setsub] = useState('');
  let page = 1;
  let isLoading = false;
  const fetchAPI = async(f) => {   
    isLoading = true;
    let url;
    let pageUrl = `page=${page}`;
    if(query === 1){
      url = `${mainUrl}${clientID}&${pageUrl}`;
    }else if(query===2){
      let queryUrl = `query=${inp}`;
      url = `${searchUrl}${clientID}&${pageUrl}&${queryUrl}`;
      console.log(url);
    }
    try {
      setLoading(true);
      const res = await fetch(url);
      const ret = await res.json();
      console.log(ret);
      if(f=='search'){
        if(!Array.isArray(ret)){
          setData([...ret.results]);
        }else{
          setData([...ret]);
        }
      }else if(f=='scroll'){
        if(!Array.isArray(ret)){
          setData(data => [...data,...ret.results]);
        }else{
          setData(data => [...data,...ret]);
        }
      }
      
    } catch (error) {
      console.log(error);
      setApifalse(true);
    }finally{
      isLoading = false;
      setLoading(false);
    }  
    
  }
  useEffect(
    ()=> {
      fetchAPI('search');
    }
    ,[sub]);
  useEffect(
   () => {
    document.addEventListener('scroll', scrolldown);
    return () => {
      document.removeEventListener('scroll', scrolldown)
    }
   }
  ,[]);
  
  const scrolldown = () => {
    if(apifalse){
      setLoading(false);
      console.log("no longer existed");
      return;
    }else if(isLoading){
      return;
    }
    else{
      if(Math.floor(document.body.offsetHeight-window.scrollY-window.innerHeight)<=0.9){
        page+=1;
        fetchAPI('scroll');
      }
    }
    
  }
  
  const handleChange = (e) => {
    setApifalse(false);
    setInp(e.target.value);
  }
  const search = (e) => {
    if(inp){
      Setsub(inp);
      setQuery(2);
    }else{
      Setsub('');
      setQuery(1);
    }
    e.preventDefault();
  }
  // console.log(data.length);
  return <main>
    <section className='search'>
      <form className='search-form'>
        <input 
          type='text'
          className='form-input'
          value={inp}
          onChange={(e) => handleChange(e)}
          placeholder='search'
        />
        <button
        type='submit'
        className='submit-btn'
        onClick={search}
        >
          <FaSearch />
        </button>
      </form>
    </section>

    <section className='photos'>
    <div className="photos-center">
      {
        data.map((item,index) => {
          return <Photo key={index} {...item}/>
        })
      }
    </div>
    </section>
    {loading&&<h2 className='loading'>Loading...</h2>}
  </main>
}

export default App
 