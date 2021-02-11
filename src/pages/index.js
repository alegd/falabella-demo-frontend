import 'styles/home.module.css';

import React from 'react';
import { useRouter } from 'next/router';
import { IndexNavbar, SearchBar } from 'components';

const Home = () => {
  const router = useRouter();

  const handleSearch = (values) => {
    router.push({ pathname: '/agents/search', query: { q: values.search } });
  };

  return (
    <>
      <IndexNavbar fixed />
      <section className="justify-center items-center flex flex-col h-screen">
        <img className="h-auto w-64" src="images/logo-full.svg" alt="Logo" />
        <div className="m-8 lg:w-full flex justify-center">
          <SearchBar handleSearch={handleSearch} />
        </div>
      </section>
    </>
  );
};

export default Home;
