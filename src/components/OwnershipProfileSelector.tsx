
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useOwnership } from "@/contexts/OwnershipContext";
import { Check, UserPlus } from "lucide-react";

interface OwnershipProfileSelectorProps {
  selectedProfileId: string | null;
  onSelectProfile: (profileId: string) => void;
  onAddNew: () => void;
}

const OwnershipProfileSelector = ({
  selectedProfileId,
  onSelectProfile,
  onAddNew,
}: OwnershipProfileSelectorProps) => {
  const { getAllProfiles } = useOwnership();
  const profiles = getAllProfiles();

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Perfis de Titularidade</h3>
      
      {profiles.length > 0 ? (
        <RadioGroup
          value={selectedProfileId || ""}
          onValueChange={onSelectProfile}
          className="space-y-4"
        >
          {profiles.map((profile) => (
            <div key={profile.id} className="flex items-center space-x-2 border p-3 rounded-lg">
              <RadioGroupItem value={profile.id} id={profile.id} />
              <Label htmlFor={profile.id} className="flex-1 cursor-pointer">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{profile.name}</p>
                    <p className="text-sm text-muted-foreground">{profile.document}</p>
                  </div>
                  {selectedProfileId === profile.id && (
                    <Check className="h-4 w-4 text-green-500" />
                  )}
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      ) : (
        <p className="text-muted-foreground text-sm mb-4">
          Nenhum perfil de titularidade cadastrado.
        </p>
      )}
      
      <Button
        variant="outline"
        className="w-full mt-4"
        onClick={onAddNew}
      >
        <UserPlus className="h-4 w-4 mr-2" />
        Adicionar Novo Perfil
      </Button>
    </Card>
  );
};

export default OwnershipProfileSelector;
