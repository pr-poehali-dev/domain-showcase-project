import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

interface ServerPlan {
  id: number;
  name: string;
  price: number;
  ram: string;
  cpu: string;
  storage: string;
  slots: number;
  ddos: boolean;
  backup: boolean;
}

interface UserServer {
  id: number;
  plan: ServerPlan;
  serverName: string;
  status: 'online' | 'offline' | 'starting';
  uptime: string;
  players: number;
  expiresAt: string;
  cpuUsage: number;
  ramUsage: number;
}

interface User {
  email: string;
  username: string;
  balance: number;
  servers: UserServer[];
}

const PLANS: ServerPlan[] = [
  { id: 1, name: 'Starter', price: 500, ram: '2 ГБ', cpu: '2 vCPU', storage: '10 ГБ SSD', slots: 10, ddos: false, backup: false },
  { id: 2, name: 'Basic', price: 1000, ram: '4 ГБ', cpu: '3 vCPU', storage: '25 ГБ SSD', slots: 25, ddos: true, backup: false },
  { id: 3, name: 'Advanced', price: 2000, ram: '8 ГБ', cpu: '4 vCPU', storage: '50 ГБ SSD', slots: 50, ddos: true, backup: true },
  { id: 4, name: 'Pro', price: 3500, ram: '16 ГБ', cpu: '6 vCPU', storage: '100 ГБ SSD', slots: 100, ddos: true, backup: true },
  { id: 5, name: 'Ultimate', price: 6000, ram: '32 ГБ', cpu: '8 vCPU', storage: '200 ГБ SSD', slots: 200, ddos: true, backup: true },
  { id: 6, name: 'Enterprise', price: 10000, ram: '64 ГБ', cpu: '12 vCPU', storage: '500 ГБ NVMe', slots: 500, ddos: true, backup: true },
];

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [selectedPlan, setSelectedPlan] = useState<ServerPlan | null>(null);
  const [serverName, setServerName] = useState('');

  const handleAuth = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const username = formData.get('username') as string || email.split('@')[0];

    setUser({
      email,
      username,
      balance: 15000,
      servers: []
    });
    setIsLoggedIn(true);
  };

  const handleCreateServer = () => {
    if (!user || !selectedPlan || !serverName || user.balance < selectedPlan.price) return;

    const newServer: UserServer = {
      id: Date.now(),
      plan: selectedPlan,
      serverName,
      status: 'offline',
      uptime: '0m',
      players: 0,
      expiresAt: '10.11.2025',
      cpuUsage: 0,
      ramUsage: 0
    };

    setUser({
      ...user,
      balance: user.balance - selectedPlan.price,
      servers: [...user.servers, newServer]
    });
    setSelectedPlan(null);
    setServerName('');
  };

  const toggleServerStatus = (serverId: number) => {
    if (!user) return;
    
    setUser({
      ...user,
      servers: user.servers.map(server => 
        server.id === serverId 
          ? { 
              ...server, 
              status: server.status === 'online' ? 'offline' : 'online',
              cpuUsage: server.status === 'online' ? 0 : Math.floor(Math.random() * 60) + 20,
              ramUsage: server.status === 'online' ? 0 : Math.floor(Math.random() * 50) + 30,
              uptime: server.status === 'online' ? '0m' : '24m'
            }
          : server
      )
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>
      
      <nav className="border-b border-white/10 bg-[#0f1523]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 animate-fade-in">
            <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Icon name="Server" size={24} className="text-white" />
            </div>
            <div>
              <span className="text-2xl font-heading font-bold text-white">
                HostCraft
              </span>
              <div className="text-xs text-blue-400/80 -mt-1">Game Hosting</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn && user ? (
              <>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 animate-scale-in">
                  <Icon name="Wallet" size={18} className="text-green-400" />
                  <span className="font-semibold text-white">{user.balance.toLocaleString()} ₽</span>
                </div>
                <Button variant="outline" className="gap-2 border-white/10 bg-white/5 text-white hover:bg-white/10">
                  <Icon name="User" size={18} />
                  {user.username}
                </Button>
              </>
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-blue-500/25">
                    <Icon name="LogIn" size={18} />
                    Войти
                  </Button>
                </DialogTrigger>
                <DialogContent className="animate-scale-in bg-[#0f1523] border-white/10 text-white">
                  <DialogHeader>
                    <DialogTitle className="font-heading text-2xl text-white">
                      {authMode === 'login' ? 'Вход в панель' : 'Создать аккаунт'}
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                      {authMode === 'login' ? 'Войдите для управления серверами' : 'Зарегистрируйтесь и получите бонус 15,000₽'}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAuth} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-300">Email</Label>
                      <Input id="email" name="email" type="email" required placeholder="your@email.com" className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" />
                    </div>
                    {authMode === 'register' && (
                      <div className="space-y-2">
                        <Label htmlFor="username" className="text-gray-300">Имя пользователя</Label>
                        <Input id="username" name="username" required placeholder="username" className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-gray-300">Пароль</Label>
                      <Input id="password" name="password" type="password" required placeholder="••••••••" className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" />
                    </div>
                    <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                      {authMode === 'login' ? 'Войти' : 'Зарегистрироваться'}
                    </Button>
                    <p className="text-center text-sm text-gray-400">
                      {authMode === 'login' ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
                      <button
                        type="button"
                        onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                        className="text-blue-400 hover:underline"
                      >
                        {authMode === 'login' ? 'Создать' : 'Войти'}
                      </button>
                    </p>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12 relative z-10">
        {!isLoggedIn ? (
          <div className="text-center py-20 space-y-8 animate-slide-up">
            <div className="inline-block px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">
              🎮 Профессиональный игровой хостинг
            </div>
            <h1 className="text-7xl font-heading font-bold text-white leading-tight">
              Создай свой
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                игровой сервер
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Мощные серверы с DDoS защитой, автобэкапами и моментальным развертыванием
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8">
              <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20">
                <Icon name="Zap" size={32} className="text-blue-400 mb-3" />
                <div className="text-2xl font-bold text-white mb-1">99.9%</div>
                <div className="text-sm text-gray-400">Uptime</div>
              </div>
              <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20">
                <Icon name="Shield" size={32} className="text-purple-400 mb-3" />
                <div className="text-2xl font-bold text-white mb-1">DDoS</div>
                <div className="text-sm text-gray-400">Защита</div>
              </div>
              <div className="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20">
                <Icon name="Gauge" size={32} className="text-green-400 mb-3" />
                <div className="text-2xl font-bold text-white mb-1">NVMe</div>
                <div className="text-sm text-gray-400">SSD диски</div>
              </div>
              <div className="p-6 rounded-xl bg-gradient-to-br from-pink-500/10 to-pink-600/5 border border-pink-500/20">
                <Icon name="Clock" size={32} className="text-pink-400 mb-3" />
                <div className="text-2xl font-bold text-white mb-1">24/7</div>
                <div className="text-sm text-gray-400">Поддержка</div>
              </div>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="servers" className="space-y-8">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-white/5 border border-white/10">
              <TabsTrigger value="servers" className="gap-2 data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
                <Icon name="Server" size={18} />
                Мои серверы
              </TabsTrigger>
              <TabsTrigger value="plans" className="gap-2 data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
                <Icon name="ShoppingCart" size={18} />
                Тарифы
              </TabsTrigger>
            </TabsList>

            <TabsContent value="plans" className="space-y-6">
              <div className="text-center space-y-2 animate-fade-in">
                <h2 className="text-4xl font-heading font-bold text-white">Выберите тариф</h2>
                <p className="text-gray-400">Подберите оптимальную конфигурацию для вашего сервера</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {PLANS.map((plan, index) => (
                  <Card
                    key={plan.id}
                    className="p-6 bg-gradient-to-br from-white/5 to-white/[0.02] border-white/10 hover:border-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 cursor-pointer animate-slide-up backdrop-blur-sm"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="space-y-5">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-2xl font-heading font-bold text-white">{plan.name}</h3>
                          {plan.id >= 4 && (
                            <Badge className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border-yellow-500/30">
                              Популярный
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-bold text-white">{plan.price.toLocaleString()}</span>
                          <span className="text-gray-400">₽/мес</span>
                        </div>
                      </div>

                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-3 text-gray-300">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <Icon name="Cpu" size={16} className="text-blue-400" />
                          </div>
                          <span><span className="font-semibold text-white">{plan.cpu}</span></span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
                          <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                            <Icon name="MemoryStick" size={16} className="text-purple-400" />
                          </div>
                          <span><span className="font-semibold text-white">{plan.ram}</span> RAM</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
                          <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                            <Icon name="HardDrive" size={16} className="text-green-400" />
                          </div>
                          <span><span className="font-semibold text-white">{plan.storage}</span></span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
                          <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center">
                            <Icon name="Users" size={16} className="text-pink-400" />
                          </div>
                          <span>До <span className="font-semibold text-white">{plan.slots}</span> игроков</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
                          <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                            <Icon name={plan.ddos ? "ShieldCheck" : "ShieldOff"} size={16} className={plan.ddos ? "text-orange-400" : "text-gray-500"} />
                          </div>
                          <span className={plan.ddos ? "text-white" : "text-gray-500"}>DDoS защита</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
                          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                            <Icon name={plan.backup ? "Database" : "DatabaseZap"} size={16} className={plan.backup ? "text-cyan-400" : "text-gray-500"} />
                          </div>
                          <span className={plan.backup ? "text-white" : "text-gray-500"}>Автобэкапы</span>
                        </div>
                      </div>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            onClick={() => setSelectedPlan(plan)}
                            disabled={user!.balance < plan.price}
                            className="w-full gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
                          >
                            <Icon name="Rocket" size={16} />
                            Создать сервер
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="animate-scale-in bg-[#0f1523] border-white/10 text-white">
                          <DialogHeader>
                            <DialogTitle className="font-heading text-2xl text-white">Создание сервера</DialogTitle>
                            <DialogDescription className="text-gray-400">
                              Настройте ваш новый игровой сервер
                            </DialogDescription>
                          </DialogHeader>
                          {selectedPlan && (
                            <div className="space-y-4">
                              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                                <div className="text-sm text-gray-400 mb-2">Выбранный тариф</div>
                                <div className="text-xl font-heading font-bold text-white">{selectedPlan.name}</div>
                                <div className="text-sm text-gray-400 mt-1">
                                  {selectedPlan.cpu} • {selectedPlan.ram} • {selectedPlan.storage}
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="serverName" className="text-gray-300">Название сервера</Label>
                                <Input 
                                  id="serverName" 
                                  value={serverName}
                                  onChange={(e) => setServerName(e.target.value)}
                                  placeholder="Мой крутой сервер"
                                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                                />
                              </div>

                              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                <span className="text-gray-400">Стоимость:</span>
                                <span className="text-2xl font-bold text-white">{selectedPlan.price.toLocaleString()} ₽</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">Ваш баланс:</span>
                                <span className="font-semibold text-white">{user!.balance.toLocaleString()} ₽</span>
                              </div>
                              
                              <Button
                                onClick={handleCreateServer}
                                disabled={user!.balance < selectedPlan.price || !serverName}
                                className="w-full gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                              >
                                <Icon name="Check" size={18} />
                                Подтвердить создание
                              </Button>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="servers" className="space-y-6">
              <div className="text-center space-y-2 animate-fade-in">
                <h2 className="text-4xl font-heading font-bold text-white">Панель управления</h2>
                <p className="text-gray-400">Управляйте вашими серверами</p>
              </div>

              <div className="max-w-6xl mx-auto space-y-6">
                <Card className="p-6 bg-gradient-to-br from-white/5 to-white/[0.02] border-white/10 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="text-lg font-heading font-semibold text-white">Баланс аккаунта</h3>
                      <p className="text-sm text-gray-400">Используйте для аренды серверов</p>
                    </div>
                    <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                      <Icon name="Wallet" size={28} className="text-green-400" />
                      <span className="text-3xl font-bold text-white">{user!.balance.toLocaleString()} ₽</span>
                    </div>
                  </div>
                </Card>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-heading font-semibold text-white">Активные серверы ({user!.servers.length})</h3>
                  </div>
                  
                  {user!.servers.length === 0 ? (
                    <Card className="p-16 text-center bg-gradient-to-br from-white/5 to-white/[0.02] border-white/10 backdrop-blur-sm">
                      <div className="space-y-4">
                        <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10">
                          <Icon name="Server" size={40} className="text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-heading font-semibold text-xl text-white mb-2">Нет активных серверов</h4>
                          <p className="text-gray-400 mb-6">
                            Создайте свой первый сервер во вкладке "Тарифы"
                          </p>
                        </div>
                      </div>
                    </Card>
                  ) : (
                    <div className="grid gap-6">
                      {user!.servers.map((server) => (
                        <Card key={server.id} className="p-6 bg-gradient-to-br from-white/5 to-white/[0.02] border-white/10 hover:border-blue-500/30 transition-all backdrop-blur-sm animate-slide-up">
                          <div className="space-y-6">
                            <div className="flex items-start justify-between">
                              <div className="space-y-3 flex-1">
                                <div className="flex items-center gap-3">
                                  <Icon name="Server" size={28} className="text-blue-400" />
                                  <div>
                                    <h4 className="font-heading font-semibold text-2xl text-white">{server.serverName}</h4>
                                    <div className="text-sm text-gray-400">{server.plan.name} • Истекает {server.expiresAt}</div>
                                  </div>
                                  <Badge className={
                                    server.status === 'online' 
                                      ? 'gap-1 bg-green-500/20 text-green-400 border-green-500/30' 
                                      : 'gap-1 bg-gray-500/20 text-gray-400 border-gray-500/30'
                                  }>
                                    <div className={`w-2 h-2 rounded-full ${server.status === 'online' ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
                                    {server.status === 'online' ? 'Онлайн' : 'Оффлайн'}
                                  </Badge>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                    <div className="text-xs text-gray-400 mb-1">Процессор</div>
                                    <div className="font-semibold text-white">{server.plan.cpu}</div>
                                    <Progress value={server.cpuUsage} className="mt-2 h-1" />
                                    <div className="text-xs text-gray-400 mt-1">{server.cpuUsage}%</div>
                                  </div>
                                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                    <div className="text-xs text-gray-400 mb-1">Память</div>
                                    <div className="font-semibold text-white">{server.plan.ram}</div>
                                    <Progress value={server.ramUsage} className="mt-2 h-1" />
                                    <div className="text-xs text-gray-400 mt-1">{server.ramUsage}%</div>
                                  </div>
                                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                    <div className="text-xs text-gray-400 mb-1">Игроки</div>
                                    <div className="font-semibold text-white">{server.players}/{server.plan.slots}</div>
                                    <Progress value={(server.players / server.plan.slots) * 100} className="mt-2 h-1" />
                                  </div>
                                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                    <div className="text-xs text-gray-400 mb-1">Uptime</div>
                                    <div className="font-semibold text-white">{server.uptime}</div>
                                    <div className="text-xs text-green-400 mt-1">Стабильно</div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-white/10">
                              <Button
                                onClick={() => toggleServerStatus(server.id)}
                                className={
                                  server.status === 'online'
                                    ? 'gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30'
                                    : 'gap-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30'
                                }
                              >
                                <Icon name={server.status === 'online' ? 'Square' : 'Play'} size={16} />
                                {server.status === 'online' ? 'Остановить' : 'Запустить'}
                              </Button>
                              <Button variant="outline" className="gap-2 border-white/10 bg-white/5 text-white hover:bg-white/10">
                                <Icon name="RotateCw" size={16} />
                                Перезапуск
                              </Button>
                              <Button variant="outline" className="gap-2 border-white/10 bg-white/5 text-white hover:bg-white/10">
                                <Icon name="Terminal" size={16} />
                                Консоль
                              </Button>
                              <Button variant="outline" className="gap-2 border-white/10 bg-white/5 text-white hover:bg-white/10">
                                <Icon name="Settings" size={16} />
                                Настройки
                              </Button>
                              <Button variant="outline" className="gap-2 border-white/10 bg-white/5 text-white hover:bg-white/10 ml-auto">
                                <Icon name="FileText" size={16} />
                                Файлы
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
};

export default Index;
