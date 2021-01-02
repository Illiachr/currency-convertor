'use strict';

// Global variables

const converter = document.getElementById('conveter'),
    currenciesList = document.querySelector('.currencies'),
    addCurrenciesList = document.querySelector('.add-currency-list'),
    displayedCurr = ['USD', 'RUB'],
    dataUrl = 'http://data.fixer.io/api/latest?access_key=149e0f53485aab085c7df327a1c5fd9f';
let currencies = [
        {
            name: "US Dollar",
            abbreviation: "USD",
            symbol: "\u0024",
            flagURL: "http://www.geonames.org/flags/l/us.gif"
        },
        {
            name: "Euro",
            abbreviation: "EUR",
            symbol: "\u20AC",
            flagURL: "https://upload.wikimedia.org/wikipedia/commons/b/b7/Flag_of_Europe.svg"
        },
        {
            name: "Russian Ruble",
            abbreviation: "RUB",
            symbol: "\u20BD",
            flagURL: "http://www.geonames.org/flags/l/ru.gif",
        },
        {
            name: "Ukrainian Hryvna",
            abbreviation: "UAH",
            symbol: "\u20B4",
            flagURL: "http://www.geonames.org/flags/l/ua.gif"
        },
        {
            name: "Japanese Yen",
            abbreviation: "JPY",
            symbol: "\u00A5",
            flagURL: "http://www.geonames.org/flags/l/jp.gif"
        },
        {
            name: "British Pound",
            abbreviation: "GBP",
            symbol: "\u00A3",
            flagURL: "http://www.geonames.org/flags/l/uk.gif"
        },
        {
            name: "Australian Dollar",
            abbreviation: "AUD",
            symbol: "\u0024",
            flagURL: "http://www.geonames.org/flags/l/au.gif"
        },
        {
            name: "Canadian Dollar",
            abbreviation: "CAD",
            symbol: "\u0024",
            flagURL: "http://www.geonames.org/flags/l/ca.gif"
        },
        {
            name: "Swiss Franc",
            abbreviation: "CHF",
            symbol: "\u0043\u0048\u0046",
            flagURL: "http://www.geonames.org/flags/l/ch.gif"
        },
        {
            name: "Chinese Yuan Renminbi",
            abbreviation: "CNY",
            symbol: "\u00A5",
            flagURL: "http://www.geonames.org/flags/l/cn.gif"
        },
        {
            name: "New Zealand Dollar",
            abbreviation: "NZD",
            symbol: "\u0024",
            flagURL: "http://www.geonames.org/flags/l/nz.gif"
        },
        {
            name: "Czech Koruna",
            abbreviation: "CZK",
            symbol: "\u004B\u010D",
            flagURL: "http://www.geonames.org/flags/l/cz.gif"
        },
        {
            name: "Hungarian Forint",
            abbreviation: "HUF",
            symbol: "\u0046\u0074",
            flagURL: "http://www.geonames.org/flags/l/hu.gif"
        },
        {
            name: "Polish Zloty",
            abbreviation: "PLN",
            symbol: "\u007A\u0142",
            flagURL: "http://www.geonames.org/flags/l/pl.gif"
        },
        {
            name: "Israeli Shekel",
            abbreviation: "ILS",
            symbol: "\u20AA",
            flagURL: "http://www.geonames.org/flags/l/il.gif"
        }
    ],
    baseCurr,
    baseCurrAmount;

// Auxiliary functions

const findRate = (currAbr, currenciesDb = currencies) =>
        currenciesDb.find(c => c.abbreviation === currAbr).rate,

    refreshExchRate = (currAbr, currRate, baseCurrRate, baseCurrAbr = baseCurr) =>
        (currAbr === baseCurrAbr ? 1 : (currRate / baseCurrRate).toFixed(4)),

    populateAddCurrList = () => {
        currencies.forEach(currency => {
            addCurrenciesList.insertAdjacentHTML('beforeend', `
        <li data-currency="${currency.abbreviation}">
                <img src="${currency.flagURL}" alt="${currency.abbreviation}" class="flag">
                <span>${currency.abbreviation} - ${currency.name}</span>
            </li>
        `);
        });
    }, // end populateAddCurrList

    createItemCurrList = currency => {
        if (currenciesList.childElementCount === 0) {
            baseCurr = currency.abbreviation;
            baseCurrAmount = 0;
        }
        addCurrenciesList.querySelector(`[data-currency=${currency.abbreviation}]`).classList.add('disabled');
        const baseCurrRate = findRate(baseCurr),
            exchangeRate = refreshExchRate(currency.abbreviation, currency.rate, baseCurrRate),
            inputVal = baseCurrAmount ? (baseCurrAmount * exchangeRate).toFixed(4) : '';

        currenciesList.insertAdjacentHTML('beforeend', `
        <li class="currency ${currency.abbreviation === baseCurr ? 'base-currency' : ''}" id=${currency.abbreviation}>
                <img src=${currency.flagURL} alt=${currency.abbreviation} class="flag">
                <div class="info">
                    <p class="input">
                        <span class="currency-symbol">${currency.symbol}</span>
                        <input type="text" placeholder="0.0000" value=${inputVal}>
                    </p>
                    <p class="currency-name">${currency.abbreviation} - ${currency.name}</p>
                    <p class="base-currency-rate">1 ${baseCurr} = ${exchangeRate} ${currency.abbreviation}</p>
                </div>
                <span class="close">&times;</span>
            </li>
        `);
    }, // end createItemCurrList

    setNewBaseCurr = newBaseCurrElem => {
        newBaseCurrElem.classList.add('base-currency');
        baseCurr = newBaseCurrElem.id;
        const baseCurrRate = findRate(baseCurr);
        currenciesList.querySelectorAll('.currency').forEach(item => {
            const currRate = findRate(item.id),
                exchangeRate = refreshExchRate(item.id, currRate, baseCurrRate);
            item.querySelector('.base-currency-rate').textContent = `1 ${baseCurr} = ${exchangeRate} ${item.id}`;
        });
    }, // end newBaseCurrElem

    render = () => {
        displayedCurr.forEach(currId => {
            const currency = currencies.find(c => c.abbreviation === currId);
            if (currency) { createItemCurrList(currency); }
        });
    }, // end render

    handlClick = e => {
        const target = e.target;

        if (target.closest('.add-currency-list li')) {
            const clickedElem = target.closest('.add-currency-list li');
            console.log(clickedElem.dataset.currency);
            if (!clickedElem.classList.contains('disabled')) {
                const newCurr = currencies.find(c => c.abbreviation === clickedElem.dataset.currency);
                if (newCurr) { createItemCurrList(newCurr); }
            }
        }

        if (target.matches('.close')) {
            const parentNode = target.parentNode;
            addCurrenciesList.querySelector(`[data-currency=${parentNode.id}]`).classList.remove('disabled');
            parentNode.remove();
            // если удалена базовая валюта
            if (parentNode.classList.contains('base-currency')) {
                const newBaseCurrElem = currenciesList.querySelector('.currency');
                // Если список не пустой
                if (newBaseCurrElem) {
                    setNewBaseCurr(newBaseCurrElem);
                    baseCurrAmount = parseFloat(newBaseCurrElem.querySelector('.input input').value);
                }
            }
        }

        if (target.closest('.add-currency-btn')) {
            target.closest('.add-currency-btn').classList.toggle('open');
        }
    },

    handlInputChange = e => {
        const target = e.target,
            isNewBaseCurr = target.closest('li').id !== baseCurr;
        if (isNewBaseCurr) {
            currenciesList.querySelector(`#${baseCurr}`).classList.remove('base-currency');
            setNewBaseCurr(target.closest('li'));
        }
        const newBaseCurrAmount = isNaN(target.value) ? 0 : parseFloat(target.value);

        if (baseCurrAmount !== newBaseCurrAmount || isNewBaseCurr) {
            baseCurrAmount = newBaseCurrAmount;
            const baseCurrRate = findRate(baseCurr);
            currenciesList.querySelectorAll('.currency').forEach(item => {
                const currRate = findRate(item.id),
                    exchangeRate = refreshExchRate(item.id, currRate, baseCurrRate);
                item.querySelector('.input input').value =
            exchangeRate * baseCurrAmount !== 0 ? (exchangeRate * baseCurrAmount).toFixed(4) : '';
            }); // end forEach

        }// end if
    }, // end hadlInputChange

    handlFocusOut = e => {
        const target = e.target;
        if (isNaN(target.value) || parseFloat(target.value) === 0) {
            target.value = '';
        } else {
            target.value = parseFloat(target.value).toFixed(4);
        }
    }, // end handleFocusOut

    handlkeyDown = e => {
        if (e.key === 'Enter') { e.target.blur(); }
    }, // end handlekeyDown

    handlInputValidate = e => {
        const target = e.target;
        if (target.matches('.input input')) {
            target.value = target.value.replace(/[^\d.]/, '');
        }
    },

    converterLoad = data => {
        document.querySelector('.date').textContent = `relevant to ${data.date.split('-').reverse().join('-')}`;
        data.rates[data.base] = 1;
        currencies = currencies.filter(c => data.rates[c.abbreviation]);
        currencies.forEach(c => c.rate = data.rates[c.abbreviation]);
        populateAddCurrList();
        render();
    }, // end converterLoad

    showError = err => {
        currenciesList.textContent = 'Server not responding...';
        console.error(err);
    }, // end showError

    setListeners = () => {
        currenciesList.addEventListener('input', handlInputValidate);
        currenciesList.addEventListener('change', handlInputChange);
        currenciesList.addEventListener('focusout', handlFocusOut);
        currenciesList.addEventListener('keydown', handlkeyDown);
        converter.addEventListener('click', handlClick);
    },
    init = dataUrl => {
        fetch(dataUrl)
            .then(res => {
                if (res.status !== 200) { throw new Error('Network status is not 200'); }
                return res.json();
            })
            .then(converterLoad)
            .catch(showError);
        setListeners();
    };

init(dataUrl);
