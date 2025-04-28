
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const EmptyCart = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center py-12">
      <p className="text-muted-foreground">Seu carrinho está vazio</p>
      <Button 
        variant="outline" 
        className="mt-4"
        onClick={() => navigate('/domains')}
      >
        Pesquisar domínios
      </Button>
    </div>
  );
};

export default EmptyCart;
