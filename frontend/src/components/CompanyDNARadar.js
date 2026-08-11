import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip } from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { Dna } from 'lucide-react';
import { getCompanyDNA } from '../utils/storeHelpers';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

const LABELS = ['CRM', 'Sales', 'Accounting', 'Inventory', 'HR', 'Purchase', 'Mfg', 'Project'];

export default function CompanyDNARadar({ companies, requirements, companyName, darkMode, t }) {
  const data = getCompanyDNA(companies, requirements, companyName);
  const color = t.accent;

  const chartData = {
    labels: LABELS,
    datasets: [{
      label: 'Customization intensity',
      data,
      backgroundColor: `${color}25`,
      borderColor: color,
      borderWidth: 2,
      pointBackgroundColor: color,
      pointRadius: 4,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: { display: false, stepSize: 25 },
        grid: { color: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' },
        angleLines: { color: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' },
        pointLabels: { color: darkMode ? '#a1a1aa' : '#71717a', font: { size: 10 } },
      },
    },
    plugins: { legend: { display: false } },
  };

  return (
    <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 14, padding: 20, boxShadow: t.shadow }}>
      <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, color: t.text2, display: 'flex', alignItems: 'center', gap: 6 }}>
        <Dna size={15} color={t.accent} /> Company DNA
      </h4>
      <p style={{ fontSize: 11, color: t.text3, marginBottom: 12 }}>
        {companyName?.split(' ').slice(0, 2).join(' ')} customization fingerprint
      </p>
      <div style={{ height: 220 }}>
        <Radar data={chartData} options={options} />
      </div>
    </div>
  );
}
