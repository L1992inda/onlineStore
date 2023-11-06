export  const getStaticProps = async () => {
    const getData = await fetch("https://static.burti.lv/f/dati.json");
    const data = await getData.json();
    return {
      props: { data },
    };
  };

  export default getStaticProps;