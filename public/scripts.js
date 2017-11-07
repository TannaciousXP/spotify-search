// make document shorter
let d = document;

// make call to server to get list of information
let getLists = () => {
  let req = new Request(`http://localhost:3000/getlist?q=${value}`, {
    method: 'POST'
  });
  fetch(req).then(res => {
    return res.json();
  }).then(data => console.log(data)).catch(err => console.warn('Reqest failed', err));
};
