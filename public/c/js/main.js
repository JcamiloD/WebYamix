(function ($) {
    "use strict";
    
    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });
})(jQuery);

//horarios
let clasesGlobal = [];  


async function fetchClases() {
    try {
        const response = await fetch('http://localhost:4000/api/traerPara');
        const clases = await response.json();
        clasesGlobal = clases;  

    
        const tableBody = document.querySelector('#class-all tbody');
        tableBody.innerHTML = ''; 

      
        const diasSemana = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

     
        displayClasses(clases);

      
        createFilterButtons(clases);

    } catch (error) {
        console.error('Error al cargar las clases:', error);
    }
}


function createFilterButtons(clases) {
    const filterButtonsDiv = document.getElementById('courseNav');
    filterButtonsDiv.innerHTML = '';  

    const uniqueCursos = [...new Set(clases.map(clase => clase.nombre_curso))]; 

    uniqueCursos.forEach(curso => {
        const button = document.createElement('button');  
        button.classList.add('btn', 'btn-primary', 'm-1');  
        button.textContent = curso;
        button.addEventListener('click', (event) => {
            event.preventDefault();
            filterByCourse(curso);
        });
        filterButtonsDiv.appendChild(button);
    });
}

function filterByCourse(cursoName) {
    const filteredClasses = clasesGlobal.filter(clase => clase.nombre_curso === cursoName);
    displayClasses(filteredClasses);
}


document.getElementById('clearFilter').addEventListener('click', () => {
    displayClasses(clasesGlobal); 
});


function displayClasses(clases) {
    const tableBody = document.querySelector('#class-all tbody');
    tableBody.innerHTML = '';  


    const diasSemana = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    clases.forEach(clase => {
        const row = document.createElement('tr');

        const timeCell = document.createElement('td');
        timeCell.textContent = clase.time;

        timeCell.style.backgroundColor = 'black';
        timeCell.style.color = 'white';
        timeCell.style.fontWeight = 'bold';
        timeCell.style.textAlign = 'center';
        row.appendChild(timeCell);

        diasSemana.forEach(dia => {
            const diaCell = document.createElement('td');
            const cursoInstructorDiv = document.createElement('div');
            const curso = document.createElement('div');
            curso.textContent = clase.nombre_curso;
            cursoInstructorDiv.appendChild(curso);

            const instructor = document.createElement('div');
            instructor.textContent = clase.nombre_usuario;
            cursoInstructorDiv.appendChild(instructor);

            diaCell.appendChild(cursoInstructorDiv);
            row.appendChild(diaCell);
        });

        tableBody.appendChild(row);
    });
}


fetchClases();

//cursos
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("http://localhost:4000/api/traerParaCur");
        const clases = await response.json();

        if (!clases || clases.length === 0) {
            console.warn("No se encontraron clases activas.");
            return;
        }

        // Agrupar clases en lotes de 3 para cada slide
        const groupedClasses = [];
        for (let i = 0; i < clases.length; i += 3) {
            groupedClasses.push(clases.slice(i, i + 3));
        }

        const indicators = document.querySelector("#carouselIndicators");
        const carouselInner = document.querySelector("#carouselInner");

        // Limpiar contenido previo del carrusel
        indicators.innerHTML = "";
        carouselInner.innerHTML = "";

        // Generar contenido dinámico del carrusel
        groupedClasses.forEach((group, groupIndex) => {
            // Crear indicador
            const indicator = document.createElement("li");
            indicator.setAttribute("data-target", "#customCarousel");
            indicator.setAttribute("data-slide-to", groupIndex);
            if (groupIndex === 0) indicator.classList.add("active");
            indicators.appendChild(indicator);

            // Crear slide
            const slide = document.createElement("div");
            slide.classList.add("carousel-item");
            if (groupIndex === 0) slide.classList.add("active");

            const row = document.createElement("div");
            row.classList.add("row");

            // Crear columnas dinámicamente
            group.forEach((clase, index) => {
                const col = document.createElement("div");
                col.classList.add("col-lg-4", "p-0");

                // Alternar entre los estilos de las tarjetas
                const isFirstStyle = index % 2 === 0;
                const bgClass = isFirstStyle ? "bg-secondary" : "bg-primary";
                const textClass = isFirstStyle ? "text-white" : "text-secondary";
                const iconClass = isFirstStyle ? "flaticon-training" : "flaticon-weightlifting";
                const iconColor = isFirstStyle ? "text-primary" : "text-secondary";
                const buttonText = isFirstStyle ? "Unete" : "Unete";

                const content = `
                    <div class="d-flex align-items-center ${bgClass} ${textClass} px-5" style="min-height: 300px;">
                        <i class="${iconClass} display-3 ${iconColor} mr-3"></i>
                        <div>
                            <h2 class="${textClass} mb-3">${clase.nombre_curso}</h2>
                            <p>${clase.descripcion}</p>
                            <a href="#" class="btn btn-lg btn-outline-light mt-4 px-4">${buttonText}</a>
                        </div>
                    </div>
                `;
                col.innerHTML = content;
                row.appendChild(col);
            });

            slide.appendChild(row);
            carouselInner.appendChild(slide);
        });
    } catch (error) {
        console.error("Error al cargar las clases:", error);
    }
});

//catalogo

    