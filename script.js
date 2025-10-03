// Q1
async function fetchPosts() {
    try{
        // fetch data from API
        const response= await fetch('https://jsonplaceholder.typicode.com/posts?_embed=comments&_expand=user');

        if (!response.ok) {
            throw new Error("fetch failed ${response.status}");
            
        }
        // json
        const data =await  response.json();
    }// return data
    catch (error) {
       console.error("error fetching use data") 
       return null;
    }
}
    async function fetchAuthorsFromEndpoints(endpoints) {
  const promises = endpoints.map(url =>
    fetchJson(url).catch(err => {
      console.error('Author endpoint failed:', url, err);
      return []; // tolerate an endpoint failure
    })
  );
    }
