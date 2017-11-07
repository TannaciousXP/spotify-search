// make document shorter
let d = document;

// make call to server to get list of information
let getLists = () => {
  let value = d.getElementById('display').value;

  let req = new Request(`http://localhost:3000/getList?q=${value}`, {
    method: 'POST'
  });
  fetch(req).then(res => {
    return res.json();
  }).then(data => console.log(data)).catch(err => console.warn('Request failed', err));
};
