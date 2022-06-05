// document.querySelector('#submit')


const thumbUp = document.getElementsByClassName("fa-thumbs-up");
// const thumbDown = document.getElementsByClassName("fa-thumbs-down");
const trash = document.getElementsByClassName("fa-ban");

Array.from(trash).forEach(function (element) {
  element.addEventListener('click', function () {
    const _id = this.parentNode.parentNode.id
    console.log(_id)
    fetch('orders', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        '_id': _id
      })
    }).then(function (response) {
      window.location.reload()
    })
  });
});

Array.from(thumbUp).forEach(function (element) {
  element.addEventListener('click', function () {
    const _id = this.parentNode.parentNode.id
    const barista = this.parentNode.parentNode.parentNode.parentNode.parentNode.children[0].children[0].innerText
    console.log(barista)
    fetch('orders', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        '_id': _id,
        'barista': barista
      })
    })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
        .catch(console.error)
    });
  });