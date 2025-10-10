import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

interface ServerPlan {
  id: number;
  name: string;
  price: number;
  priceUSD: number;
  ram: string;
  cpu: string;
  cpuModel: string;
  storage: string;
  bandwidth: string;
  slots: number;
  ddosLevel: 'none' | 'basic' | 'advanced' | 'premium';
  backup: boolean;
  ipv4: boolean;
  ipv6: boolean;
  os: string[];
  ssh: boolean;
}

interface User {
  id: number;
  email: string;
  username: string;
  balance: number;
}

const PLANS: ServerPlan[] = [
  { id: 1, name: 'VPS Starter', price: 374, priceUSD: 4.3, ram: '2.5 ГБ DDR5', cpu: '2 ядра x 5700MHz', cpuModel: 'Ryzen 9 7950X3D', storage: '35 ГБ NVMe SSD', bandwidth: '800/200 Mbps', slots: 10, ddosLevel: 'basic', backup: false, ipv4: true, ipv6: true, os: ['Debian', 'Ubuntu', 'CentOS'], ssh: true },
  { id: 2, name: 'VPS Basic', price: 749, priceUSD: 8.6, ram: '4 ГБ DDR5', cpu: '3 ядра x 5700MHz', cpuModel: 'Ryzen 9 7950X3D', storage: '50 ГБ NVMe SSD', bandwidth: '1000/300 Mbps', slots: 25, ddosLevel: 'advanced', backup: true, ipv4: true, ipv6: true, os: ['Debian', 'Ubuntu', 'CentOS', 'Windows'], ssh: true },
  { id: 3, name: 'VPS Advanced', price: 1498, priceUSD: 17.2, ram: '8 ГБ DDR5', cpu: '4 ядра x 5700MHz', cpuModel: 'Ryzen 9 7950X3D', storage: '100 ГБ NVMe SSD', bandwidth: '1000/500 Mbps', slots: 50, ddosLevel: 'advanced', backup: true, ipv4: true, ipv6: true, os: ['Debian', 'Ubuntu', 'CentOS', 'Windows', 'ISO'], ssh: true },
  { id: 4, name: 'VPS Pro', price: 2622, priceUSD: 30.1, ram: '16 ГБ DDR5', cpu: '6 ядер x 5700MHz', cpuModel: 'Ryzen 9 7950X3D', storage: '200 ГБ NVMe SSD', bandwidth: '1000/1000 Mbps', slots: 100, ddosLevel: 'premium', backup: true, ipv4: true, ipv6: true, os: ['Debian', 'Ubuntu', 'CentOS', 'Windows', 'ISO'], ssh: true },
  { id: 5, name: 'VDS Ultimate', price: 4371, priceUSD: 50.2, ram: '32 ГБ DDR5', cpu: '8 ядер x 5700MHz', cpuModel: 'Ryzen 9 7950X3D', storage: '400 ГБ NVMe SSD', bandwidth: '1000/1000 Mbps', slots: 200, ddosLevel: 'premium', backup: true, ipv4: true, ipv6: true, os: ['Debian', 'Ubuntu', 'CentOS', 'Windows', 'ISO'], ssh: true },
  { id: 6, name: 'VDS Enterprise', price: 8742, priceUSD: 100.4, ram: '64 ГБ DDR5', cpu: '12 ядер x 5700MHz', cpuModel: 'Ryzen 9 7950X3D', storage: '1 ТБ NVMe SSD', bandwidth: '10 Gbps Full', slots: 500, ddosLevel: 'premium', backup: true, ipv4: true, ipv6: true, os: ['Debian', 'Ubuntu', 'CentOS', 'Windows', 'ISO'], ssh: true },
];

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedDDoS, setSelectedDDoS] = useState<string[]>([]);
  const [onlyBackup, setOnlyBackup] = useState(false);
  const [onlySSH, setOnlySSH] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    try {
      const response = await fetch('https://functions.poehali.dev/5ce8eb5d-7a57-41ee-a1be-d4a6442a2b82', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: authMode,
          email,
          username,
          password
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
      } else {
        alert(data.error || 'Authentication failed');
      }
    } catch (error) {
      alert('Connection error');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const filteredPlans = PLANS.filter(plan => {
    if (plan.price < priceRange[0] || plan.price > priceRange[1]) return false;
    if (selectedDDoS.length > 0 && !selectedDDoS.includes(plan.ddosLevel)) return false;
    if (onlyBackup && !plan.backup) return false;
    if (onlySSH && !plan.ssh) return false;
    return true;
  });

  const getDDoSBadge = (level: string) => {
    const badges = {
      none: { text: 'Нет защиты', color: 'bg-gray-500/10 text-gray-400 border-gray-500/20' },
      basic: { text: 'L3/L4', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
      advanced: { text: 'Advanced L3/L4', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
      premium: { text: 'Premium L3/L4/L7', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' }
    };
    return badges[level as keyof typeof badges];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <nav className="border-b bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
              <Icon name="Server" size={24} className="text-white" />
            </div>
            <div>
              <span className="text-2xl font-heading font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                CloudHost
              </span>
              <div className="text-xs text-gray-500 -mt-1">Premium VPS/VDS</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                  <Icon name="Wallet" size={18} className="text-green-600" />
                  <span className="font-semibold text-gray-800">{user.balance.toLocaleString()} ₽</span>
                </div>
                <Button variant="outline" className="gap-2">
                  <Icon name="User" size={18} />
                  {user.username}
                </Button>
                <Button variant="ghost" onClick={handleLogout} className="gap-2">
                  <Icon name="LogOut" size={18} />
                </Button>
              </>
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    <Icon name="LogIn" size={18} />
                    Войти
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-heading">
                      {authMode === 'login' ? 'Вход в аккаунт' : 'Регистрация'}
                    </DialogTitle>
                    <DialogDescription>
                      {authMode === 'login' ? 'Войдите для управления серверами' : 'Создайте аккаунт и получите 15,000₽ на старте'}
                    </DialogDescription>
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
                    <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                      {authMode === 'login' ? 'Войти' : 'Зарегистрироваться'}
                    </Button>
                    <p className="text-center text-sm text-gray-600">
                      {authMode === 'login' ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
                      <button
                        type="button"
                        onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                        className="text-blue-600 hover:underline font-medium"
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

      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/40 via-indigo-50/30 to-purple-100/40"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100">
              🚀 Мощные VPS на Ryzen 9 7950X3D 5700 MHz
            </Badge>
            <h1 className="text-6xl md:text-7xl font-heading font-bold text-gray-900 leading-tight">
              Игровой хостинг
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                нового поколения
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              VPS/VDS серверы на базе AMD Ryzen 9 7950X3D с NVMe SSD, DDR5 памятью и профессиональной DDoS защитой L3/L4
            </p>
            
            <div className="flex gap-4 justify-center pt-6">
              <Button size="lg" className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8">
                <Icon name="Rocket" size={20} />
                Выбрать тариф
              </Button>
              <Button size="lg" variant="outline" className="gap-2 text-lg px-8">
                <Icon name="Play" size={20} />
                Как это работает
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <Icon name="Zap" size={32} className="text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">99.9%</div>
              <div className="text-sm text-gray-600">Uptime гарантия</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                <Icon name="Shield" size={32} className="text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">L3/L4</div>
              <div className="text-sm text-gray-600">DDoS защита</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                <Icon name="Gauge" size={32} className="text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">NVMe</div>
              <div className="text-sm text-gray-600">SSD диски</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                <Icon name="Clock" size={32} className="text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">24/7</div>
              <div className="text-sm text-gray-600">Поддержка</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold text-gray-900 mb-4">Наши тарифы</h2>
            <p className="text-lg text-gray-600">Выберите оптимальную конфигурацию для ваших задач</p>
          </div>

          <Card className="p-6 mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-base font-semibold">Цена в месяц: {priceRange[0]}₽ - {priceRange[1]}₽</Label>
                  <Button variant="ghost" size="sm" onClick={() => setPriceRange([0, 10000])}>Сбросить</Button>
                </div>
                <Slider
                  min={0}
                  max={10000}
                  step={100}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="w-full"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-base font-semibold mb-3 block">Уровень DDoS защиты</Label>
                  <div className="space-y-2">
                    {['basic', 'advanced', 'premium'].map(level => (
                      <div key={level} className="flex items-center space-x-2">
                        <Checkbox
                          id={level}
                          checked={selectedDDoS.includes(level)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedDDoS([...selectedDDoS, level]);
                            } else {
                              setSelectedDDoS(selectedDDoS.filter(d => d !== level));
                            }
                          }}
                        />
                        <label htmlFor={level} className="text-sm font-medium cursor-pointer">
                          {getDDoSBadge(level).text}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base font-semibold mb-3 block">Дополнительно</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="backup"
                        checked={onlyBackup}
                        onCheckedChange={(checked) => setOnlyBackup(checked as boolean)}
                      />
                      <label htmlFor="backup" className="text-sm font-medium cursor-pointer">
                        Только с автобэкапами
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="ssh"
                        checked={onlySSH}
                        onCheckedChange={(checked) => setOnlySSH(checked as boolean)}
                      />
                      <label htmlFor="ssh" className="text-sm font-medium cursor-pointer">
                        Root доступ по SSH
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {filteredPlans.length === 0 ? (
            <Card className="p-12 text-center">
              <Icon name="SearchX" size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ничего не найдено</h3>
              <p className="text-gray-600 mb-4">Попробуйте изменить параметры фильтрации</p>
              <Button variant="outline" onClick={() => { setPriceRange([0, 10000]); setSelectedDDoS([]); setOnlyBackup(false); setOnlySSH(false); }}>
                Сбросить фильтры
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPlans.map((plan, index) => (
                <Card
                  key={plan.id}
                  className="relative overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {plan.id >= 4 && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                        ⭐ Популярный
                      </Badge>
                    </div>
                  )}
                  
                  <div className="p-6 space-y-6">
                    <div>
                      <h3 className="text-2xl font-heading font-bold text-gray-900 mb-2">{plan.name}</h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm text-gray-500">от</span>
                        <span className="text-4xl font-bold text-gray-900">{plan.priceUSD}$</span>
                        <span className="text-gray-500">/ месяц</span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">~{plan.price} руб.</div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
                        <Icon name="Cpu" size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900">{plan.cpu}</div>
                          <div className="text-xs text-gray-600">{plan.cpuModel}</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-50 border border-purple-100">
                        <Icon name="MemoryStick" size={20} className="text-purple-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900">{plan.ram}</div>
                          <div className="text-xs text-gray-600">DDR5 RAM</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 border border-green-100">
                        <Icon name="HardDrive" size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900">{plan.storage}</div>
                          <div className="text-xs text-gray-600">NVMe SSD диски</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-50 border border-orange-100">
                        <Icon name="Network" size={20} className="text-orange-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900">{plan.bandwidth}</div>
                          <div className="text-xs text-gray-600">Полоса пропускания</div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">DDoS Защита</span>
                        <Badge className={getDDoSBadge(plan.ddosLevel).color}>
                          {getDDoSBadge(plan.ddosLevel).text}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">IPv4 + IPv6</span>
                        <Icon name="Check" size={16} className="text-green-600" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Root SSH</span>
                        <Icon name="Check" size={16} className="text-green-600" />
                      </div>
                      {plan.backup && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Автобэкапы</span>
                          <Icon name="Check" size={16} className="text-green-600" />
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">ОС</span>
                        <span className="text-sm font-medium text-gray-900">{plan.os.length}+ систем</span>
                      </div>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 gap-2 group-hover:shadow-lg transition-shadow">
                      <Icon name="Rocket" size={18} />
                      Заказать сервер
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-heading font-bold mb-6">Готовы начать?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Создайте свой сервер за 60 секунд и получите полный контроль над хостингом
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 gap-2 text-lg px-8">
            <Icon name="Sparkles" size={20} />
            Попробовать бесплатно
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
