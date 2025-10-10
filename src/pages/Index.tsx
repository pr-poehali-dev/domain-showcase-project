import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
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
  const [isDark, setIsDark] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedDDoS, setSelectedDDoS] = useState<string[]>([]);
  const [onlyBackup, setOnlyBackup] = useState(false);
  const [onlySSH, setOnlySSH] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedTheme = localStorage.getItem('theme');
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedTheme) setIsDark(savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    localStorage.setItem('theme', !isDark ? 'dark' : 'light');
  };

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
        body: JSON.stringify({ action: authMode, email, username, password })
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
      none: { text: 'Нет защиты', color: isDark ? 'bg-gray-500/20 text-gray-300 border-gray-500/30' : 'bg-gray-100 text-gray-600 border-gray-200' },
      basic: { text: 'L3/L4', color: isDark ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'bg-blue-100 text-blue-700 border-blue-200' },
      advanced: { text: 'Advanced L3/L4', color: isDark ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 'bg-purple-100 text-purple-700 border-purple-200' },
      premium: { text: 'Premium L3/L4/L7', color: isDark ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' : 'bg-yellow-100 text-yellow-700 border-yellow-200' }
    };
    return badges[level as keyof typeof badges];
  };

  const bgClass = isDark ? 'bg-[#0a0e1a]' : 'bg-gradient-to-br from-gray-50 via-white to-blue-50';
  const cardClass = isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-300' : 'text-gray-600';
  const navClass = isDark ? 'border-white/10 bg-[#0f1523]/80' : 'border-gray-200 bg-white/80';

  return (
    <div className={bgClass}>
      <nav className={`${navClass} border-b backdrop-blur-xl sticky top-0 z-50 shadow-sm`}>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
              <Icon name="Server" size={24} className="text-white" />
            </div>
            <div>
              <span className="text-2xl font-heading font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                CloudHost
              </span>
              <div className={`text-xs ${textSecondary} -mt-1`}>Premium VPS/VDS</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              <Icon name={isDark ? 'Sun' : 'Moon'} size={20} />
            </Button>
            
            {user ? (
              <>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isDark ? 'bg-green-500/10 border-green-500/20' : 'bg-green-50 border-green-200'} border`}>
                  <Icon name="Wallet" size={18} className="text-green-600" />
                  <span className={`font-semibold ${textPrimary}`}>{user.balance.toLocaleString()} ₽</span>
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
                <DialogContent className={cardClass}>
                  <DialogHeader>
                    <DialogTitle className={`text-2xl font-heading ${textPrimary}`}>
                      {authMode === 'login' ? 'Вход в аккаунт' : 'Регистрация'}
                    </DialogTitle>
                    <DialogDescription className={textSecondary}>
                      {authMode === 'login' ? 'Войдите для управления серверами' : 'Создайте аккаунт и получите 15,000₽'}
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
                    <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600">
                      {authMode === 'login' ? 'Войти' : 'Зарегистрироваться'}
                    </Button>
                    <p className={`text-center text-sm ${textSecondary}`}>
                      {authMode === 'login' ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
                      <button type="button" onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="text-blue-600 hover:underline font-medium">
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

      <section className={`relative py-20 overflow-hidden ${isDark ? 'bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5' : ''}`}>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <Badge className={isDark ? 'bg-blue-500/10 text-blue-300 border-blue-500/20' : 'bg-blue-100 text-blue-700 border-blue-200'}>
              🚀 Мощные VPS на Ryzen 9 7950X3D 5700 MHz
            </Badge>
            <h1 className={`text-6xl md:text-7xl font-heading font-bold ${textPrimary} leading-tight`}>
              Игровой хостинг
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                нового поколения
              </span>
            </h1>
            <p className={`text-xl ${textSecondary} max-w-2xl mx-auto`}>
              VPS/VDS серверы на базе AMD Ryzen 9 7950X3D с NVMe SSD, DDR5 памятью и профессиональной DDoS защитой L3/L4
            </p>
            <div className="flex gap-4 justify-center pt-6">
              <Button size="lg" className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-lg px-8">
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

      <section className={`py-16 ${isDark ? 'bg-white/5' : 'bg-white'} border-y ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: 'Zap', value: '99.9%', label: 'Uptime гарантия', color: 'blue' },
              { icon: 'Shield', value: 'L3/L4', label: 'DDoS защита', color: 'purple' },
              { icon: 'Gauge', value: 'NVMe', label: 'SSD диски', color: 'green' },
              { icon: 'Clock', value: '24/7', label: 'Поддержка', color: 'orange' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-${stat.color}-100 to-${stat.color}-200 flex items-center justify-center ${isDark ? 'opacity-80' : ''}`}>
                  <Icon name={stat.icon as any} size={32} className={`text-${stat.color}-600`} />
                </div>
                <div className={`text-3xl font-bold ${textPrimary} mb-1`}>{stat.value}</div>
                <div className={`text-sm ${textSecondary}`}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20" id="tariffs">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className={`text-4xl font-heading font-bold ${textPrimary} mb-4`}>Наши тарифы</h2>
            <p className={`text-lg ${textSecondary}`}>Выберите оптимальную конфигурацию для ваших задач</p>
          </div>

          <Card className={`${cardClass} p-6 mb-8`}>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className={`text-base font-semibold ${textPrimary}`}>Цена в месяц: {priceRange[0]}₽ - {priceRange[1]}₽</Label>
                  <Button variant="ghost" size="sm" onClick={() => setPriceRange([0, 10000])}>Сбросить</Button>
                </div>
                <Slider min={0} max={10000} step={100} value={priceRange} onValueChange={setPriceRange} />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className={`text-base font-semibold mb-3 block ${textPrimary}`}>Уровень DDoS защиты</Label>
                  <div className="space-y-2">
                    {['basic', 'advanced', 'premium'].map(level => (
                      <div key={level} className="flex items-center space-x-2">
                        <Checkbox
                          id={level}
                          checked={selectedDDoS.includes(level)}
                          onCheckedChange={(checked) => {
                            if (checked) setSelectedDDoS([...selectedDDoS, level]);
                            else setSelectedDDoS(selectedDDoS.filter(d => d !== level));
                          }}
                        />
                        <label htmlFor={level} className={`text-sm font-medium cursor-pointer ${textPrimary}`}>
                          {getDDoSBadge(level).text}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className={`text-base font-semibold mb-3 block ${textPrimary}`}>Дополнительно</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="backup" checked={onlyBackup} onCheckedChange={(c) => setOnlyBackup(c as boolean)} />
                      <label htmlFor="backup" className={`text-sm font-medium cursor-pointer ${textPrimary}`}>Только с автобэкапами</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="ssh" checked={onlySSH} onCheckedChange={(c) => setOnlySSH(c as boolean)} />
                      <label htmlFor="ssh" className={`text-sm font-medium cursor-pointer ${textPrimary}`}>Root доступ по SSH</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {filteredPlans.length === 0 ? (
            <Card className={`${cardClass} p-12 text-center`}>
              <Icon name="SearchX" size={48} className={`mx-auto mb-4 ${textSecondary}`} />
              <h3 className={`text-xl font-semibold ${textPrimary} mb-2`}>Ничего не найдено</h3>
              <p className={`${textSecondary} mb-4`}>Попробуйте изменить параметры фильтрации</p>
              <Button variant="outline" onClick={() => { setPriceRange([0, 10000]); setSelectedDDoS([]); setOnlyBackup(false); setOnlySSH(false); }}>
                Сбросить фильтры
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPlans.map((plan, index) => (
                <Card key={plan.id} className={`${cardClass} relative overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2`}>
                  {plan.id >= 4 && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">⭐ Популярный</Badge>
                    </div>
                  )}
                  
                  <div className="p-6 space-y-6">
                    <div>
                      <h3 className={`text-2xl font-heading font-bold ${textPrimary} mb-2`}>{plan.name}</h3>
                      <div className="flex items-baseline gap-2">
                        <span className={`text-sm ${textSecondary}`}>от</span>
                        <span className={`text-4xl font-bold ${textPrimary}`}>{plan.priceUSD}$</span>
                        <span className={textSecondary}>/ месяц</span>
                      </div>
                      <div className={`text-sm ${textSecondary} mt-1`}>~{plan.price} руб.</div>
                    </div>

                    <div className="space-y-3">
                      {[
                        { icon: 'Cpu', label: plan.cpu, sublabel: plan.cpuModel, color: isDark ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-100' },
                        { icon: 'MemoryStick', label: plan.ram, sublabel: 'DDR5 RAM', color: isDark ? 'bg-purple-500/10 border-purple-500/20' : 'bg-purple-50 border-purple-100' },
                        { icon: 'HardDrive', label: plan.storage, sublabel: 'NVMe SSD диски', color: isDark ? 'bg-green-500/10 border-green-500/20' : 'bg-green-50 border-green-100' },
                        { icon: 'Network', label: plan.bandwidth, sublabel: 'Полоса пропускания', color: isDark ? 'bg-orange-500/10 border-orange-500/20' : 'bg-orange-50 border-orange-100' }
                      ].map((spec, i) => (
                        <div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${spec.color} border`}>
                          <Icon name={spec.icon as any} size={20} className={`${isDark ? 'text-white' : 'text-gray-900'} mt-0.5 flex-shrink-0`} />
                          <div className="flex-1 min-w-0">
                            <div className={`font-semibold ${textPrimary}`}>{spec.label}</div>
                            <div className={`text-xs ${textSecondary}`}>{spec.sublabel}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className={`pt-4 border-t ${isDark ? 'border-white/10' : 'border-gray-200'} space-y-2`}>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${textSecondary}`}>DDoS Защита</span>
                        <Badge className={getDDoSBadge(plan.ddosLevel).color}>{getDDoSBadge(plan.ddosLevel).text}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${textSecondary}`}>IPv4 + IPv6</span>
                        <Icon name="Check" size={16} className="text-green-600" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${textSecondary}`}>Root SSH</span>
                        <Icon name="Check" size={16} className="text-green-600" />
                      </div>
                      {plan.backup && (
                        <div className="flex items-center justify-between">
                          <span className={`text-sm ${textSecondary}`}>Автобэкапы</span>
                          <Icon name="Check" size={16} className="text-green-600" />
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${textSecondary}`}>ОС</span>
                        <span className={`text-sm font-medium ${textPrimary}`}>{plan.os.length}+ систем</span>
                      </div>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 gap-2">
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

      <section className={`py-20 ${isDark ? 'bg-white/5' : 'bg-gray-50'}`} id="features">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className={`text-4xl font-heading font-bold ${textPrimary} mb-4`}>Почему мы?</h2>
            <p className={`text-lg ${textSecondary}`}>Профессиональный хостинг с полным набором возможностей</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { icon: 'Zap', title: 'Моментальный деплой', desc: 'Сервер готов к работе через 60 секунд после оплаты. Автоматическая настройка и установка ОС.' },
              { icon: 'ShieldCheck', title: 'Многоуровневая защита', desc: 'Профессиональная DDoS защита L3/L4/L7. Фильтрация трафика до 1 Тбит/с. Защита от всех типов атак.' },
              { icon: 'Database', title: 'Автоматические бэкапы', desc: 'Ежедневные автобэкапы данных. Хранение копий до 7 дней. Восстановление в один клик.' },
              { icon: 'Gauge', title: 'Высокая производительность', desc: 'AMD Ryzen 9 7950X3D с частотой 5700 MHz. NVMe SSD с скоростью до 7000 MB/s. DDR5 память.' },
              { icon: 'Globe', title: 'Полный контроль', desc: 'Root доступ по SSH. Установка любого ПО. Полная настройка firewall. Выбор ОС из списка или ISO образ.' },
              { icon: 'Headphones', title: 'Поддержка 24/7', desc: 'Техническая поддержка круглосуточно. Среднее время ответа 5 минут. Telegram, email, тикет-система.' }
            ].map((feature, i) => (
              <Card key={i} className={`${cardClass} p-6 hover:shadow-lg transition-shadow`}>
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mb-4`}>
                  <Icon name={feature.icon as any} size={28} className="text-white" />
                </div>
                <h3 className={`text-xl font-heading font-bold ${textPrimary} mb-2`}>{feature.title}</h3>
                <p className={textSecondary}>{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20" id="faq">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className={`text-4xl font-heading font-bold ${textPrimary} mb-4`}>Частые вопросы</h2>
            <p className={`text-lg ${textSecondary}`}>Ответы на популярные вопросы о нашем хостинге</p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {[
              { q: 'Как быстро активируется сервер после оплаты?', a: 'Сервер автоматически активируется в течение 60 секунд после подтверждения оплаты. Вы получите доступы на email и в личный кабинет.' },
              { q: 'Могу ли я установить свою ОС?', a: 'Да, вы можете выбрать из готовых образов (Debian, Ubuntu, CentOS, Windows Server) или загрузить свой ISO образ в панели управления.' },
              { q: 'Как работает DDoS защита?', a: 'Мы используем многоуровневую защиту с фильтрацией на уровне L3/L4/L7. Система автоматически обнаруживает и блокирует вредоносный трафик, пропуская только легитимные запросы.' },
              { q: 'Есть ли гарантия возврата средств?', a: 'Да, мы предоставляем 7-дневную гарантию возврата средств. Если вас не устроит качество услуг, мы вернем деньги без объяснения причин.' },
              { q: 'Можно ли увеличить ресурсы сервера?', a: 'Да, вы можете в любой момент перейти на более мощный тариф. Апгрейд происходит без переустановки ОС, все данные сохраняются.' },
              { q: 'Как связаться с технической поддержкой?', a: 'Поддержка доступна 24/7 через тикет-систему, Telegram-бот или email. Среднее время ответа - 5 минут. Для критических проблем - звонок по телефону.' },
              { q: 'Включены ли бэкапы в тариф?', a: 'Автоматические бэкапы включены в тарифы Basic и выше. Резервные копии создаются ежедневно и хранятся 7 дней. Вы также можете создавать ручные снапшоты.' },
              { q: 'Какая пропускная способность канала?', a: 'Пропускная способность зависит от тарифа: от 800/200 Mbps на Starter до 10 Gbps на Enterprise. Канал выделенный, без ограничений трафика.' }
            ].map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`} className={`${cardClass} border px-6 rounded-lg`}>
                <AccordionTrigger className={`${textPrimary} font-semibold hover:no-underline`}>{item.q}</AccordionTrigger>
                <AccordionContent className={textSecondary}>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className={`py-20 ${isDark ? 'bg-white/5' : 'bg-gray-50'}`} id="support">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className={`text-4xl font-heading font-bold ${textPrimary} mb-4`}>Техническая поддержка</h2>
            <p className={`text-lg ${textSecondary}`}>Мы всегда на связи, чтобы помочь вам</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: 'MessageCircle', title: 'Telegram', desc: 'Быстрые ответы через бот', link: '@cloudhost_support' },
              { icon: 'Mail', title: 'Email', desc: 'Подробные консультации', link: 'support@cloudhost.ru' },
              { icon: 'Phone', title: 'Телефон', desc: 'Критические проблемы', link: '+7 (800) 555-35-35' }
            ].map((contact, i) => (
              <Card key={i} className={`${cardClass} p-6 text-center hover:shadow-lg transition-shadow`}>
                <div className={`w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mb-4`}>
                  <Icon name={contact.icon as any} size={28} className="text-white" />
                </div>
                <h3 className={`text-lg font-heading font-bold ${textPrimary} mb-2`}>{contact.title}</h3>
                <p className={`text-sm ${textSecondary} mb-3`}>{contact.desc}</p>
                <p className="text-blue-600 font-semibold">{contact.link}</p>
              </Card>
            ))}
          </div>

          <Card className={`${cardClass} p-8 mt-12`}>
            <h3 className={`text-2xl font-heading font-bold ${textPrimary} mb-6 text-center`}>Отправить вопрос</h3>
            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Ваше имя</Label>
                  <Input id="name" placeholder="Иван Иванов" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Email</Label>
                  <Input id="contact-email" type="email" placeholder="your@email.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Тема вопроса</Label>
                <Input id="subject" placeholder="Проблема с сервером" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Сообщение</Label>
                <textarea id="message" className={`w-full min-h-32 px-3 py-2 rounded-lg border ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'} resize-none`} placeholder="Опишите вашу проблему подробно..."></textarea>
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600">
                Отправить сообщение
              </Button>
            </form>
          </Card>
        </div>
      </section>

      <footer className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200'} border-t py-12`}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                  <Icon name="Server" size={20} className="text-white" />
                </div>
                <span className="text-xl font-heading font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">CloudHost</span>
              </div>
              <p className={`text-sm ${textSecondary}`}>Профессиональный VPS/VDS хостинг для ваших проектов</p>
            </div>
            
            {[
              { title: 'Продукты', links: ['VPS серверы', 'VDS серверы', 'Dedicated', 'Colocation'] },
              { title: 'Компания', links: ['О нас', 'Новости', 'Вакансии', 'Контакты'] },
              { title: 'Поддержка', links: ['База знаний', 'Документация', 'API', 'Статус'] }
            ].map((col, i) => (
              <div key={i}>
                <h4 className={`font-heading font-bold ${textPrimary} mb-4`}>{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <a href="#" className={`text-sm ${textSecondary} hover:text-blue-600 transition-colors`}>{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className={`mt-12 pt-8 border-t ${isDark ? 'border-white/10' : 'border-gray-200'} flex flex-col md:flex-row justify-between items-center gap-4`}>
            <p className={`text-sm ${textSecondary}`}>© 2025 CloudHost. Все права защищены.</p>
            <div className="flex gap-6">
              {['Политика конфиденциальности', 'Условия использования', 'SLA'].map((link, i) => (
                <a key={i} href="#" className={`text-sm ${textSecondary} hover:text-blue-600 transition-colors`}>{link}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
