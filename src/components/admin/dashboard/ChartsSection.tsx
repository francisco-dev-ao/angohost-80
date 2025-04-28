
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Sample data for charts
const salesData = [
  { name: "Jan", value: 1200 },
  { name: "Fev", value: 1900 },
  { name: "Mar", value: 1500 },
  { name: "Abr", value: 2200 },
  { name: "Mai", value: 1800 },
  { name: "Jun", value: 2800 },
  { name: "Jul", value: 2100 },
  { name: "Ago", value: 2500 },
  { name: "Set", value: 2800 },
  { name: "Out", value: 3200 },
  { name: "Nov", value: 3800 },
  { name: "Dez", value: 4100 },
];

const registrationsData = [
  { name: "Dom", domains: 4, hosting: 2 },
  { name: "Seg", domains: 3, hosting: 1 },
  { name: "Ter", domains: 5, hosting: 3 },
  { name: "Qua", domains: 7, hosting: 5 },
  { name: "Qui", domains: 2, hosting: 4 },
  { name: "Sex", domains: 6, hosting: 2 },
  { name: "Sab", domains: 8, hosting: 6 },
];

const ChartsSection = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Vendas Mensais</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                name="Vendas (AOA)"
                stroke="#8884d8"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Registros Semanais</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={registrationsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="domains" name="Domínios" fill="#8884d8" />
              <Bar dataKey="hosting" name="Hospedagem" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartsSection;
