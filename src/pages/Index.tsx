import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

interface Domain {
  id: number;
  name: string;
  price: number;
  storage: string;
  cpu: string;
  ddos: boolean;
  status: 'available' | 'pending' | 'active';
}

interface User {
  email: string;
  username: string;
  balance: number;
  domains: Domain[];
}

const MOCK_DOMAINS: Domain[] = [
  { id: 1, name: 'myawesomesite.com', price: 1500, storage: '500 ГБ', cpu: 'High Performance', ddos: true, status: 'available' },
  { id: 2, name: 'coolstartup.io', price: 2000, storage: '500 ГБ', cpu: 'High Performance', ddos: true, status: 'available' },
  { id: 3, name: 'techblog.dev', price: 1200, storage: '500 ГБ', cpu: 'High Performance', ddos: true, status: 'available' },
  { id: 4, name: 'gamingportal.gg', price: 2500, storage: '500 ГБ', cpu: 'High Performance', ddos: true, status: 'available' },
  { id: 5, name: 'creativestudio.art', price: 1800, storage: '500 ГБ', cpu: 'High Performance', ddos: true, status: 'available' },
  { id: 6, name: 'businesshub.pro', price: 3000, storage: '500 ГБ', cpu: 'High Performance', ddos: true, status: 'available' },
];

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);

  const handleAuth = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const username = formData.get('username') as string || email.split('@')[0];

    setUser({
      email,
      username,
      balance: 10000,
      domains: []
    });
    setIsLoggedIn(true);
  };

  const handlePurchase = (domain: Domain) => {
    if (!user || user.balance < domain.price) return;

    const purchasedDomain = { ...domain, status: 'active' as const };
    setUser({
      ...user,
      balance: user.balance - domain.price,
      domains: [...user.domains, purchasedDomain]
    });
    setSelectedDomain(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <nav className="border-b bg-background/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 animate-fade-in">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center animate-gradient-shift bg-200">
              <Icon name="Globe" size={24} className="text-white" />
            </div>
            <span className="text-2xl font-heading font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              DomainHub
            </span>
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn && user ? (
              <>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 animate-scale-in">
                  <Icon name="Coins" size={20} className="text-accent" />
                  <span className="font-semibold">{user.balance.toLocaleString()} ₽</span>
                </div>
                <Button variant="outline" className="gap-2">
                  <Icon name="User" size={18} />
                  {user.username}
                </Button>
              </>
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-primary hover:bg-primary/90">
                    <Icon name="LogIn" size={18} />
                    Войти
                  </Button>
                </DialogTrigger>
                <DialogContent className="animate-scale-in">
                  <DialogHeader>
                    <DialogTitle className="font-heading text-2xl">
                      {authMode === 'login' ? 'Вход' : 'Регистрация'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAuth} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" required placeholder="your@email.com" />
                    </div>
                    {authMode === 'register' && (
                      <div className="space-y-2">
                        <Label htmlFor="username">Имя пользователя</Label>
                        <Input id="username" name="username" required placeholder="username" />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="password">Пароль</Label>
                      <Input id="password" name="password" type="password" required placeholder="••••••••" />
                    </div>
                    <Button type="submit" className="w-full">
                      {authMode === 'login' ? 'Войти' : 'Зарегистрироваться'}
                    </Button>
                    <p className="text-center text-sm text-muted-foreground">
                      {authMode === 'login' ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
                      <button
                        type="button"
                        onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                        className="text-primary hover:underline"
                      >
                        {authMode === 'login' ? 'Зарегистрироваться' : 'Войти'}
                      </button>
                    </p>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        {!isLoggedIn ? (
          <div className="text-center py-20 space-y-6 animate-slide-up">
            <h1 className="text-6xl font-heading font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient-shift bg-200">
              Игровой Маркетплейс Доменов
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Покупайте домены за виртуальную валюту, управляйте хостингом и создавайте свои проекты
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <div className="flex items-center gap-2 px-6 py-3 rounded-lg bg-card border">
                <Icon name="HardDrive" size={24} className="text-primary" />
                <div className="text-left">
                  <div className="text-sm text-muted-foreground">Хранилище</div>
                  <div className="font-semibold">500 ГБ</div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 rounded-lg bg-card border">
                <Icon name="Cpu" size={24} className="text-secondary" />
                <div className="text-left">
                  <div className="text-sm text-muted-foreground">Процессор</div>
                  <div className="font-semibold">High Performance</div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 rounded-lg bg-card border">
                <Icon name="Shield" size={24} className="text-accent" />
                <div className="text-left">
                  <div className="text-sm text-muted-foreground">Защита</div>
                  <div className="font-semibold">DDoS Protection</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="catalog" className="space-y-8">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="catalog" className="gap-2">
                <Icon name="Store" size={18} />
                Каталог
              </TabsTrigger>
              <TabsTrigger value="cabinet" className="gap-2">
                <Icon name="LayoutDashboard" size={18} />
                Кабинет
              </TabsTrigger>
            </TabsList>

            <TabsContent value="catalog" className="space-y-6">
              <div className="text-center space-y-2 animate-fade-in">
                <h2 className="text-4xl font-heading font-bold">Доступные домены</h2>
                <p className="text-muted-foreground">Выберите домен для своего проекта</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_DOMAINS.map((domain, index) => (
                  <Card
                    key={domain.id}
                    className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Icon name="Globe" size={20} className="text-primary" />
                          <h3 className="font-heading font-semibold text-lg">{domain.name}</h3>
                        </div>
                        <Badge variant="secondary" className="gap-1">
                          <Icon name="Check" size={14} />
                          Доступен
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Icon name="HardDrive" size={16} />
                          <span>{domain.storage}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Icon name="Cpu" size={16} />
                          <span>{domain.cpu}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Icon name="Shield" size={16} />
                          <span>DDoS Protection</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon name="Coins" size={20} className="text-accent" />
                          <span className="text-2xl font-bold">{domain.price.toLocaleString()}</span>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              onClick={() => setSelectedDomain(domain)}
                              disabled={user!.balance < domain.price}
                              className="gap-2"
                            >
                              <Icon name="ShoppingCart" size={16} />
                              Купить
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="animate-scale-in">
                            <DialogHeader>
                              <DialogTitle className="font-heading text-2xl">Подтвердить покупку</DialogTitle>
                            </DialogHeader>
                            {selectedDomain && (
                              <div className="space-y-4">
                                <div className="p-4 rounded-lg bg-muted space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Icon name="Globe" size={20} className="text-primary" />
                                    <span className="font-semibold text-lg">{selectedDomain.name}</span>
                                  </div>
                                  <div className="text-sm text-muted-foreground space-y-1">
                                    <div className="flex items-center gap-2">
                                      <Icon name="Calendar" size={14} />
                                      <span>Активация: 1 месяц</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Icon name="RefreshCw" size={14} />
                                      <span>Автопродление доступно</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between text-lg">
                                  <span>Стоимость:</span>
                                  <div className="flex items-center gap-2">
                                    <Icon name="Coins" size={20} className="text-accent" />
                                    <span className="font-bold">{selectedDomain.price.toLocaleString()} ₽</span>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                  <span>Ваш баланс:</span>
                                  <span className="font-semibold">{user!.balance.toLocaleString()} ₽</span>
                                </div>
                                <Button
                                  onClick={() => handlePurchase(selectedDomain)}
                                  className="w-full gap-2"
                                  disabled={user!.balance < selectedDomain.price}
                                >
                                  <Icon name="Check" size={18} />
                                  Подтвердить покупку
                                </Button>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="cabinet" className="space-y-6">
              <div className="text-center space-y-2 animate-fade-in">
                <h2 className="text-4xl font-heading font-bold">Личный кабинет</h2>
                <p className="text-muted-foreground">Управление вашими доменами</p>
              </div>

              <div className="max-w-4xl mx-auto space-y-6">
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="text-lg font-heading font-semibold">Баланс игровой валюты</h3>
                      <p className="text-sm text-muted-foreground">Используйте для покупки доменов</p>
                    </div>
                    <div className="flex items-center gap-3 px-6 py-3 rounded-lg bg-gradient-to-r from-accent/20 to-accent/10">
                      <Icon name="Coins" size={28} className="text-accent" />
                      <span className="text-3xl font-bold">{user!.balance.toLocaleString()} ₽</span>
                    </div>
                  </div>
                </Card>

                <div className="space-y-4">
                  <h3 className="text-2xl font-heading font-semibold">Мои домены ({user!.domains.length})</h3>
                  {user!.domains.length === 0 ? (
                    <Card className="p-12 text-center">
                      <div className="space-y-4">
                        <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                          <Icon name="Globe" size={32} className="text-muted-foreground" />
                        </div>
                        <div>
                          <h4 className="font-heading font-semibold text-lg">Нет активных доменов</h4>
                          <p className="text-sm text-muted-foreground mt-2">
                            Перейдите в каталог, чтобы приобрести свой первый домен
                          </p>
                        </div>
                      </div>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {user!.domains.map((domain) => (
                        <Card key={domain.id} className="p-6 animate-slide-up">
                          <div className="flex items-center justify-between">
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <Icon name="Globe" size={24} className="text-primary" />
                                <h4 className="font-heading font-semibold text-xl">{domain.name}</h4>
                                <Badge className="gap-1 bg-secondary">
                                  <Icon name="CheckCircle" size={14} />
                                  Активен
                                </Badge>
                              </div>
                              <div className="flex gap-6 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                  <Icon name="Calendar" size={16} />
                                  <span>До 10.11.2025</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Icon name="HardDrive" size={16} />
                                  <span>{domain.storage}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Icon name="Shield" size={16} />
                                  <span>DDoS Protection</span>
                                </div>
                              </div>
                            </div>
                            <Button variant="outline" className="gap-2">
                              <Icon name="Settings" size={16} />
                              Управление
                            </Button>
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
