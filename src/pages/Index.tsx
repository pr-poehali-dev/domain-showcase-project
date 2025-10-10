import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  gradient: string;
  tags: string[];
}

const PROJECTS: Project[] = [
  { id: 1, title: 'Нейросеть для дизайна', category: 'AI', image: '🎨', gradient: 'from-pink-500 via-purple-500 to-indigo-600', tags: ['Neural Networks', 'Design', 'Creative'] },
  { id: 2, title: 'Криптовалютный трекер', category: 'FinTech', image: '💰', gradient: 'from-green-400 via-emerald-500 to-teal-600', tags: ['Blockchain', 'Trading', 'Analytics'] },
  { id: 3, title: 'VR Метавселенная', category: 'VR/AR', image: '🥽', gradient: 'from-blue-500 via-cyan-500 to-sky-600', tags: ['Virtual Reality', '3D', 'Gaming'] },
  { id: 4, title: 'Квантовый калькулятор', category: 'Quantum', image: '⚛️', gradient: 'from-violet-500 via-purple-600 to-fuchsia-600', tags: ['Quantum', 'Science', 'Computing'] },
  { id: 5, title: 'IoT умный дом', category: 'IoT', image: '🏠', gradient: 'from-orange-400 via-red-500 to-pink-600', tags: ['IoT', 'Smart Home', 'Automation'] },
  { id: 6, title: 'Космический симулятор', category: 'Space', image: '🚀', gradient: 'from-indigo-500 via-blue-600 to-purple-600', tags: ['Space', 'Simulation', 'Physics'] },
];

const SERVICES = [
  { icon: 'Brain', title: 'ИИ разработка', desc: 'Нейросети, ML модели, компьютерное зрение', color: 'from-purple-500 to-pink-500' },
  { icon: 'Smartphone', title: 'Mobile Apps', desc: 'iOS и Android приложения премиум класса', color: 'from-blue-500 to-cyan-500' },
  { icon: 'Globe', title: 'Web3 & Blockchain', desc: 'Смарт-контракты, DeFi, NFT платформы', color: 'from-green-500 to-emerald-500' },
  { icon: 'Sparkles', title: 'AR/VR Solutions', desc: 'Виртуальная и дополненная реальность', color: 'from-orange-500 to-red-500' },
];

const Index = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeFilter, setActiveFilter] = useState('Все');
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const categories = ['Все', 'AI', 'FinTech', 'VR/AR', 'Quantum', 'IoT', 'Space'];
  const filteredProjects = activeFilter === 'Все' ? PROJECTS : PROJECTS.filter(p => p.category === activeFilter);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <div 
        className="fixed inset-0 opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.15), transparent 40%)`
        }}
      />

      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black pointer-events-none" />

      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-black/30 border-b border-white/5">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Icon name="Zap" size={24} className="text-white" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                NEBULA
              </span>
              <div className="text-xs text-gray-400 -mt-1">Digital Lab</div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {['Проекты', 'Услуги', 'О нас', 'Контакты'].map((item, i) => (
              <a 
                key={i} 
                href={`#${item.toLowerCase()}`} 
                className="text-sm text-gray-300 hover:text-white transition-colors relative group"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0 gap-2">
            <Icon name="Rocket" size={18} />
            Начать проект
          </Button>
        </div>
      </nav>

      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/5 animate-pulse"
              style={{
                width: Math.random() * 4 + 1 + 'px',
                height: Math.random() * 4 + 1 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                animationDelay: Math.random() * 3 + 's',
                animationDuration: Math.random() * 3 + 2 + 's',
              }}
            />
          ))}
        </div>

        <div 
          className="container mx-auto px-6 text-center relative z-10"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        >
          <Badge className="mb-6 bg-purple-500/10 text-purple-300 border-purple-500/20 px-6 py-2 text-sm animate-fade-in">
            🌟 Технологии будущего уже здесь
          </Badge>
          
          <h1 className="text-7xl md:text-9xl font-black mb-6 leading-none animate-scale-in">
            <span className="inline-block bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent animate-gradient-shift bg-200">
              СОЗДАЁМ
            </span>
            <br />
            <span className="text-white">НЕВОЗМОЖНОЕ</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 animate-slide-up">
            Мы разрабатываем революционные цифровые продукты, которые меняют индустрии. 
            ИИ, Web3, AR/VR, квантовые вычисления — наша игровая площадка.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 h-14 gap-3 group relative overflow-hidden">
              <span className="relative z-10 flex items-center gap-3">
                <Icon name="Sparkles" size={20} />
                Исследовать проекты
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
            
            <Button size="lg" variant="outline" className="border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-lg px-8 h-14 gap-3">
              <Icon name="Play" size={20} />
              Смотреть демо
            </Button>
          </div>

          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { value: '150+', label: 'Проектов' },
              { value: '45+', label: 'Клиентов' },
              { value: '99%', label: 'Успешных запусков' },
              { value: '24/7', label: 'Поддержка' },
            ].map((stat, i) => (
              <div key={i} className="text-center animate-fade-in" style={{ animationDelay: `${0.3 + i * 0.1}s` }}>
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <Icon name="ChevronDown" size={32} className="text-gray-600" />
        </div>
      </section>

      <section className="relative py-32" id="проекты">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-500/10 text-blue-300 border-blue-500/20">
              💎 Наши работы
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Портфолио
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Каждый проект — это прорыв в своей области
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat, i) => (
              <button
                key={i}
                onClick={() => setActiveFilter(cat)}
                className={`px-6 py-2 rounded-full border transition-all duration-300 ${
                  activeFilter === cat
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 border-transparent text-white'
                    : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, i) => (
              <div
                key={project.id}
                className="group relative animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${project.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10`} />
                
                <Card className="bg-white/5 border-white/10 backdrop-blur-xl overflow-hidden hover:border-white/20 transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl">
                  <div className={`h-48 bg-gradient-to-br ${project.gradient} flex items-center justify-center text-7xl relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/20" />
                    <span className="relative z-10 group-hover:scale-110 transition-transform duration-500">
                      {project.image}
                    </span>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/20">
                      {project.category}
                    </Badge>
                    
                    <h3 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all">
                      {project.title}
                    </h3>
                    
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, j) => (
                        <span key={j} className="text-xs px-3 py-1 rounded-full bg-white/5 text-gray-400 border border-white/10">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <Button variant="ghost" className="w-full gap-2 group/btn hover:bg-white/10">
                      Подробнее
                      <Icon name="ArrowRight" size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-32" id="услуги">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-500/10 text-green-300 border-green-500/20">
              ⚡ Что мы делаем
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                Наши услуги
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {SERVICES.map((service, i) => (
              <Card 
                key={i} 
                className="bg-white/5 border-white/10 backdrop-blur-xl p-8 hover:bg-white/10 transition-all duration-500 group relative overflow-hidden animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500`}>
                    <Icon name={service.icon as any} size={32} className="text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-3 text-white">{service.title}</h3>
                  <p className="text-gray-400 mb-6">{service.desc}</p>
                  
                  <Button variant="ghost" className="gap-2 group/btn px-0 hover:bg-transparent hover:translate-x-2 transition-transform">
                    <span className={`bg-gradient-to-r ${service.color} bg-clip-text text-transparent font-semibold`}>
                      Узнать больше
                    </span>
                    <Icon name="ArrowRight" size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-32" id="контакты">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-indigo-900/20 border-white/10 backdrop-blur-xl p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 animate-gradient-shift bg-200" />
              
              <div className="relative z-10 text-center space-y-8">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mb-6">
                  <Icon name="Rocket" size={40} className="text-white" />
                </div>
                
                <h2 className="text-5xl font-bold">
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Готовы создать что-то невероятное?
                  </span>
                </h2>
                
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  Расскажите о своей идее, и мы превратим её в реальность с помощью передовых технологий
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur-lg opacity-50 group-hover:opacity-100 transition-opacity" />
                    <Button size="lg" className="relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-10 h-14 gap-3">
                      <Icon name="MessageCircle" size={20} />
                      Начать разговор
                    </Button>
                  </div>
                  
                  <Button size="lg" variant="outline" className="border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-lg px-10 h-14 gap-3">
                    <Icon name="Mail" size={20} />
                    hello@nebula.lab
                  </Button>
                </div>

                <div className="flex justify-center gap-6 pt-8">
                  {['Github', 'Twitter', 'Linkedin', 'Youtube'].map((social, i) => (
                    <button
                      key={i}
                      className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 hover:scale-110 transition-all duration-300"
                    >
                      <Icon name={social as any} size={20} className="text-gray-400" />
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <footer className="relative py-12 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                <Icon name="Zap" size={20} className="text-white" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  NEBULA
                </span>
                <div className="text-xs text-gray-500">Digital Lab</div>
              </div>
            </div>
            
            <div className="text-sm text-gray-500">
              © 2025 NEBULA Digital Lab. Создаём будущее сегодня.
            </div>
            
            <div className="flex gap-6">
              {['Политика', 'Условия', 'Контакты'].map((link, i) => (
                <a key={i} href="#" className="text-sm text-gray-500 hover:text-white transition-colors">
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
