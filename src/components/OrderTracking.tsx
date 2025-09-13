import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, Truck, Package } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Order {
  id: string;
  customer_name: string;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
}

const statusConfig = {
  pending: { label: "Pedido Recebido", icon: Clock, color: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "Confirmado", icon: CheckCircle, color: "bg-blue-100 text-blue-800" },
  preparing: { label: "Em Preparo", icon: Package, color: "bg-orange-100 text-orange-800" },
  out_for_delivery: { label: "Saiu para Entrega", icon: Truck, color: "bg-purple-100 text-purple-800" },
  delivered: { label: "Entregue", icon: CheckCircle, color: "bg-green-100 text-green-800" },
  cancelled: { label: "Cancelado", icon: Clock, color: "bg-red-100 text-red-800" },
};

export const OrderTracking = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    // Set up real-time subscription
    const channel = supabase
      .channel('orders_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('Order update received:', payload);
          fetchOrders(); // Refetch orders when there's a change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-1/3 mb-4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Você ainda não fez nenhum pedido.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Meus Pedidos</h2>
      
      {orders.map((order) => {
        const statusInfo = statusConfig[order.status as keyof typeof statusConfig];
        const StatusIcon = statusInfo.icon;
        
        return (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    Pedido #{order.id.slice(-8)}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleString('pt-BR')}
                  </p>
                </div>
                <Badge className={statusInfo.color}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {statusInfo.label}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">
                    Total: R$ {order.total_amount.toFixed(2).replace('.', ',')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Pagamento: {order.payment_status === 'paid' ? 'Pago' : 'Pendente'}
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    Última atualização:
                  </p>
                  <p className="text-sm">
                    {new Date(order.updated_at).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="mt-6">
                <div className="flex justify-between items-center">
                  {Object.entries(statusConfig).slice(0, 4).map(([key, config], index) => {
                    const StepIcon = config.icon;
                    const isActive = Object.keys(statusConfig).indexOf(order.status) >= index;
                    const isCurrent = order.status === key;
                    
                    return (
                      <div key={key} className="flex flex-col items-center flex-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isCurrent 
                            ? 'bg-primary text-primary-foreground' 
                            : isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-muted text-muted-foreground'
                        }`}>
                          <StepIcon className="h-4 w-4" />
                        </div>
                        <p className={`text-xs mt-2 text-center ${
                          isCurrent ? 'font-medium' : 'text-muted-foreground'
                        }`}>
                          {config.label}
                        </p>
                        {index < 3 && (
                          <div className={`absolute w-full h-0.5 top-4 left-1/2 ${
                            Object.keys(statusConfig).indexOf(order.status) > index
                              ? 'bg-green-300'
                              : 'bg-muted'
                          }`} style={{ zIndex: -1 }} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};