const axios = require('axios');
const fs = require('fs');

async function getAllResults() {
  let currentPage = 1;
  const perPage = 10;
  const totalPages = await getNumberOfPages(perPage);
  const odaList = [];

  console.log(perPage, totalPages);

  while (currentPage <= totalPages) {
    const results = await getResults(currentPage, perPage);

    odaList.push(
      ...results.filter((el) => {
        return new Date(el.created_at).getYear() >= new Date('2017', '').getYear();
      }).map((el) => { return el }));

    currentPage++;
  }

  return odaList;
}

async function getNumberOfPages(perPage) {
  const options = {
    url: `http://pat.educacao.ba.gov.br/api/v1/conteudos?tipos=&licencas=&componentes=&per=tag&page=0&busca=&limit=1`,
    method: 'GET',
  };

  const response = await axios(options);

  return Math.ceil(response.data.paginator.total / perPage);
}

async function getResults(page, perPage) {
  const options = {
    url: `http://pat.educacao.ba.gov.br/api/v1/conteudos?tipos=&licencas=&componentes=&per=tag&page=${page}&busca=&limit=${perPage}`,
    method: 'GET',
  };

  const response = await axios(options);

  return response.data.paginator.data;
}

(async () => {
  const results = await getAllResults();
  fs.promises.writeFile('results.json', JSON.stringify(results));
})();