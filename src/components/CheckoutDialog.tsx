import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/hooks/useCart";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CreditCard, Smartphone, QrCode } from "lucide-react";

interface CheckoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutDialog = ({ isOpen, onClose }: CheckoutDialogProps) => {
  const { state, clearCart } = useCart();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card' | 'debit_card'>('pix');
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setCustomerData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitOrder = async () => {
    if (!customerData.name || !customerData.email || !customerData.phone || !customerData.address) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erro de autenticação",
          description: "Você precisa estar logado para fazer um pedido.",
          variant: "destructive",
        });
        return;
      }

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          customer_name: customerData.name,
          customer_email: customerData.email,
          customer_phone: customerData.phone,
          delivery_address: customerData.address,
          total_amount: state.total,
          payment_method: paymentMethod,
          payment_status: 'pending',
          notes: customerData.notes,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = state.items.map(item => ({
        order_id: order.id,
        dish_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.total,
        customizations: item.customizations
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Simulate payment processing
      if (paymentMethod === 'pix') {
        toast({
          title: "Pedido criado!",
          description: "Código PIX será enviado para seu WhatsApp em instantes.",
        });
      } else {
        // For card payments, you would integrate with Stripe here
        toast({
          title: "Pedido criado!",
          description: "Redirecionando para pagamento...",
        });
      }

      clearCart();
      onClose();
      
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Erro ao criar pedido",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const paymentMethods = [
    { id: 'pix', name: 'PIX', icon: QrCode, description: 'Pagamento instantâneo' },
    { id: 'credit_card', name: 'Cartão de Crédito', icon: CreditCard, description: 'Visa, Mastercard, Elo' },
    { id: 'debit_card', name: 'Cartão de Débito', icon: Smartphone, description: 'Débito online' },
  ] as const;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Finalizar Pedido</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Summary */}
          <div>
            <h3 className="font-semibold mb-4">Resumo do Pedido</h3>
            <Card>
              <CardContent className="p-4 space-y-3">
                {state.items.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Qtd: {item.quantity} × R$ {item.price.toFixed(2).replace('.', ',')}
                      </p>
                      {Object.keys(item.customizations).length > 0 && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {Object.entries(item.customizations).map(([key, value]: [string, any]) => (
                            <span key={key} className="block">• {value.name}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="font-medium">
                      R$ {item.total.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                ))}
                
                <div className="border-t pt-3 flex justify-between items-center font-bold text-lg">
                  <span>Total:</span>
                  <span>R$ {state.total.toFixed(2).replace('.', ',')}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customer Information */}
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-4">Dados para Entrega</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    value={customerData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Seu nome completo"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="seu@email.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Telefone/WhatsApp *</Label>
                  <Input
                    id="phone"
                    value={customerData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                
                <div>
                  <Label htmlFor="address">Endereço de Entrega *</Label>
                  <Textarea
                    id="address"
                    value={customerData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Rua, número, bairro, cidade - CEP"
                    className="min-h-[80px]"
                  />
                </div>
                
                <div>
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    value={customerData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Observações especiais para o pedido"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <h3 className="font-semibold mb-4">Forma de Pagamento</h3>
              <div className="space-y-2">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <Card
                      key={method.id}
                      className={`cursor-pointer transition-all ${
                        paymentMethod === method.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setPaymentMethod(method.id)}
                    >
                      <CardContent className="p-4 flex items-center space-x-3">
                        <Icon className="h-6 w-6" />
                        <div>
                          <p className="font-medium">{method.name}</p>
                          <p className="text-sm text-muted-foreground">{method.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancelar
              </Button>
              <Button 
                onClick={handleSubmitOrder} 
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? "Processando..." : "Confirmar Pedido"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};