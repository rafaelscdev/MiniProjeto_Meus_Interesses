document.addEventListener("DOMContentLoaded", () => {
    const inputElement = document.getElementById('interest-input');
    const addButton = document.querySelector('.button-add');
    const clearButton = document.querySelector('.button-clear');
    const interestsList = document.getElementById('taskList');
    const newsElement = document.querySelector('.title-news-today');

    function loadInterests() {
        interestsList.innerHTML = '';
        const interests = localStorage.getItem('meus-interesses');
        if (interests) {
            const interestsArray = JSON.parse(interests);
            interestsArray.forEach(item => {
                const li = document.createElement('li');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = item.completed;
                checkbox.addEventListener('change', toggleComplete);
                li.appendChild(checkbox);
                li.appendChild(document.createTextNode(item.interest));
                if (item.completed) {
                    li.classList.add('completed');
                }
                interestsList.appendChild(li);
            });
        }
    }

    function addInterest() {
        const interest = inputElement.value.trim();
        if (interest) {
            let interests = localStorage.getItem('meus-interesses');
            interests = interests ? JSON.parse(interests) : [];
            interests.push({ interest: interest, completed: false });
            localStorage.setItem('meus-interesses', JSON.stringify(interests));
            inputElement.value = '';
            loadInterests();
            Swal.fire({
                icon: 'success',
                title: 'Sucesso',
                text: 'Interesse adicionado com sucesso!'
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Por favor, insira um interesse.'
            });
        }
    }

    function clearInterests() {
        localStorage.removeItem('meus-interesses');
        loadInterests();
        Swal.fire({
            icon: 'success',
            title: 'Sucesso',
            text: 'Lista de interesses limpa com sucesso!'
        });
    }

    function loadNews() {
        fetch('https://servicodados.ibge.gov.br/api/v3/noticias/?tipo=release')
            .then(response => response.json())
            .then(data => {
                if (data.items && data.items.length > 0) {
                    const firstNews = data.items[0];
                    newsElement.textContent = firstNews.titulo;
                } else {
                    newsElement.textContent = 'Nenhuma notícia encontrada.';
                }
            })
            .catch(error => {
                console.error('Erro ao carregar a notícia:', error);
                newsElement.textContent = 'Erro ao carregar a notícia.';
            });
    }

    function toggleComplete(event) {
        const li = event.target.parentElement;
        li.classList.toggle('completed');
        const interests = JSON.parse(localStorage.getItem('meus-interesses'));
        const updatedInterests = interests.map(item => {
            if (item.interest === li.textContent.trim()) {
                item.completed = event.target.checked;
            }
            return item;
        });
        localStorage.setItem('meus-interesses', JSON.stringify(updatedInterests));
        if (event.target.checked) {
            Swal.fire({
                icon: 'success',
                title: 'Concluído',
                text: 'Interesse marcado como concluído!'
            });
        } else {
            Swal.fire({
                icon: 'info',
                title: 'Desmarcado',
                text: 'Interesse marcado como não concluído.'
            });
        }
    }

    addButton.addEventListener('click', addInterest);
    clearButton.addEventListener('click', clearInterests);
    loadInterests();
    loadNews();
});
