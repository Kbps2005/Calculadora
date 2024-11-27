document.getElementById('calculate-btn').addEventListener('click', calculateInvestment);
document.getElementById('download-pdf').addEventListener('click', generatePDF);

let chart;

function calculateInvestment() {
    const initialInvestment = parseFloat(document.getElementById('initial-investment').value) || 0;
    const monthlyInvestment = parseFloat(document.getElementById('monthly-investment').value) || 0;
    const interestRate = parseFloat(document.getElementById('interest-rate').value) / 100 || 0;
    const years = parseInt(document.getElementById('years').value) || 0;

    const months = years * 12;
    let totalInvested = initialInvestment;
    let balance = initialInvestment;
    const monthlyRate = Math.pow(1 + interestRate, 1 / 12) - 1;

    const data = [];
    const monthlyDetails = [];

    for (let i = 1; i <= months; i++) {
        const interestEarned = balance * monthlyRate;
        balance += interestEarned + monthlyInvestment;
        totalInvested += monthlyInvestment;

        monthlyDetails.push({
            month: i,
            balance: balance.toFixed(2),
            interest: interestEarned.toFixed(2),
        });

        if (i % 12 === 0 || i === months) {
            data.push({ year: Math.ceil(i / 12), balance: balance.toFixed(2) });
        }
    }

    const totalReturn = balance - totalInvested;

    document.getElementById('total-invested').innerText = `Total Investido: R$ ${totalInvested.toFixed(2)}`;
    document.getElementById('total-return').innerText = `Retorno Total: R$ ${totalReturn.toFixed(2)}`;
    document.getElementById('final-balance').innerText = `Saldo Final: R$ ${balance.toFixed(2)}`;

    renderChart(data);
    displayMonthlyResults(monthlyDetails);
}

function renderChart(data) {
    const ctx = document.getElementById('investment-chart').getContext('2d');
    if (chart) chart.destroy();
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(d => `Ano ${d.year}`),
            datasets: [{
                label: 'Saldo (R$)',
                data: data.map(d => d.balance),
                borderColor: '#007bff',
                backgroundColor: 'rgba(0, 123, 255, 0.2)',
                fill: true,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true },
            },
        }
    });
}

function displayMonthlyResults(monthlyDetails) {
    const monthlyList = document.getElementById('monthly-list');
    monthlyList.innerHTML = '';

    monthlyDetails.forEach(detail => {
        const li = document.createElement('li');
        li.textContent = `Mês ${detail.month}: Saldo: R$ ${detail.balance}, Juros: R$ ${detail.interest}`;
        monthlyList.appendChild(li);
    });
}

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const totalInvested = document.getElementById('total-invested').innerText;
    const totalReturn = document.getElementById('total-return').innerText;
    const finalBalance = document.getElementById('final-balance').innerText;

    doc.setFontSize(16);
    doc.text("Relatório de Investimento", 10, 10);
    doc.setFontSize(12);
    doc.text(totalInvested, 10, 20);
    doc.text(totalReturn, 10, 30);
    doc.text(finalBalance, 10, 40);

    const canvas = document.getElementById('investment-chart');
    const image = canvas.toDataURL('image/png');
    doc.addImage(image, 'PNG', 10, 50, 180, 90);

    doc.save('relatorio-investimento.pdf');
}
