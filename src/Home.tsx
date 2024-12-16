import React, { useState, useEffect } from 'react';


interface Data1 {
  message: string
  items: any[]
}

const Home: React.FC = () => {
  const [data, setData] = useState<Data1 | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        //const response = await fetch('http://localhost:8000/api/home');
        const response = await fetch('/api/home'); 
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); 

  return (
    <div>
      <h1>Home Page      {data && data.message}      </h1>
      { data && 
        <ul>
          {data.items.map((item) => (
            <li key={item.id}>{item.name}</li> 
          ))}
        </ul>
      }
    </div>
  );
};

export default Home;
