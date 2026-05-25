import { useState, useEffect } from 'react'

type Language = 'de' | 'en' | 'vi'
type Tab = 'home' | 'menu' | 'reservation' | 'bitictionary'

function App() {
  const [language, setLanguage] = useState<Language>('en')
  const [activeTab, setActiveTab] = useState<Tab>('home')
  const [blockHeight, setBlockHeight] = useState<number | null>(null)
  const [btcPrice, setBtcPrice] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Reservierung
  const [reservation, setReservation] = useState({ date: '', time: '', people: '2', name: '', phone: '' })
  const [reservationStep, setReservationStep] = useState<'form' | 'choice' | 'sent'>('form')

  // Menu Accordion
  const [openCategory, setOpenCategory] = useState<'drinks' | 'food' | null>('drinks')

  // === BITICTIONARY ===
  const bitictionary = [
    { term: "Bitcoin", de: "Die erste dezentrale digitale Währung • Begrenzt auf 21 Millionen • Dezentral und pseudonym • Von Satoshi Nakamoto 2009 geschaffen.", en: "The first decentralized digital currency • Capped at 21 million • Decentralized and pseudonymous • Created by Satoshi Nakamoto in 2009.", vi: "Tiền tệ kỹ thuật số phi tập trung đầu tiên • Giới hạn 21 triệu • Phi tập trung và ẩn danh • Được Satoshi Nakamoto tạo năm 2009." },
    { term: "Blockchain", de: "Öffentliche, unveränderliche Kette von Blöcken • Jeder Block enthält Transaktionen • Sehr schwer zu manipulieren.", en: "Public, immutable chain of blocks • Each block contains transactions • Extremely difficult to manipulate.", vi: "Chuỗi khối công khai, không thể thay đổi • Mỗi khối chứa giao dịch • Rất khó bị thao túng." },
    { term: "Whitepaper", de: "Das Bitcoin Whitepaper von Satoshi Nakamoto (2008) • Beschreibt das Grundkonzept von Bitcoin • Titel: 'Bitcoin: A Peer-to-Peer Electronic Cash System'.", en: "Bitcoin Whitepaper by Satoshi Nakamoto (2008) • Describes the core concept of Bitcoin • Title: 'Bitcoin: A Peer-to-Peer Electronic Cash System'.", vi: "Whitepaper Bitcoin của Satoshi Nakamoto (2008) • Mô tả khái niệm cốt lõi • Tiêu đề: 'Bitcoin: A Peer-to-Peer Electronic Cash System'." },
  ]

  const filteredTerms = bitictionary
    .filter(item => 
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item[language].toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.term.localeCompare(b.term))

  // Live Blockchain Daten
  useEffect(() => {
    const fetchData = async () => {
      try {
        const blockRes = await fetch('https://mempool.space/api/blocks/tip/height')
        setBlockHeight(parseInt(await blockRes.text()))

        const priceRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,eur,vnd')
        const data = await priceRes.json()
        setBtcPrice(data.bitcoin)
      } catch (e) {}
    }
    fetchData()
    const interval = setInterval(fetchData, 10000)
    return () => clearInterval(interval)
  }, [])

  const t = {
    de: { title: "Westwood", subtitle: "Da Nang • Vietnam", home: "Start", menu: "Menü", reservation: "Tisch reservieren", bitictionary: "Bitictionary", send: "Reservierung absenden", drinks: "Getränke", food: "Essen", success: "✅ Reservierung erhalten! Wir melden uns bald bei dir.", newReservation: "Neue Reservierung", howToReceive: "Wie möchtest du die Reservierung erhalten?", whatsapp: "Per WhatsApp senden", email: "Per E-Mail senden" },
    en: { title: "Westwood", subtitle: "Da Nang • Vietnam", home: "Home", menu: "Menu", reservation: "Reserve Table", bitictionary: "Bitictionary", send: "Send Reservation", drinks: "Drinks", food: "Food", success: "✅ Reservation received! We'll contact you soon.", newReservation: "New Reservation", howToReceive: "How would you like to receive the reservation?", whatsapp: "Send via WhatsApp", email: "Send via Email" },
    vi: { title: "Westwood", subtitle: "Đà Nẵng • Việt Nam", home: "Trang chủ", menu: "Thực đơn", reservation: "Đặt bàn", bitictionary: "Bitictionary", send: "Gửi đặt bàn", drinks: "Đồ uống", food: "Đồ ăn", success: "✅ Đã nhận đặt bàn! Chúng tôi sẽ liên hệ sớm.", newReservation: "Đặt bàn mới", howToReceive: "Bạn muốn nhận đặt bàn qua?", whatsapp: "Gửi qua WhatsApp", email: "Gửi qua Email" }
  }[language]

  const calculateSats = (vndPrice: number) => {
    if (!btcPrice?.vnd) return '0';
    const sats = Math.round((vndPrice / btcPrice.vnd) * 100000000);
    return sats.toLocaleString();
  }

  const menuDrinks = [
    { name: "Espresso", priceVnd: 45000, emoji: "☕" },
    { name: "Cappuccino", priceVnd: 55000, emoji: "☕" },
    { name: "Café Latte", priceVnd: 58000, emoji: "☕" },
    { name: "Flat White", priceVnd: 52000, emoji: "☕" },
  ]

  const menuFood = [
    { name: "Avocado Toast", priceVnd: 95000, emoji: "🥑" },
    { name: "Pho Bo Mini", priceVnd: 85000, emoji: "🍜" },
    { name: "Banh Mi", priceVnd: 65000, emoji: "🥖" },
    { name: "Spring Rolls", priceVnd: 75000, emoji: "🌯" },
  ]

  const handleReservationSubmit = (e: any) => {
    e.preventDefault()
    setReservationStep('choice')
  }

  const handleSendWhatsApp = () => {
    const text = encodeURIComponent(
      `New Reservation Westwood\n\n` +
      `Name: ${reservation.name}\n` +
      `Date: ${reservation.date}\n` +
      `Time: ${reservation.time}\n` +
      `Persons: ${reservation.people}\n` +
      `Phone: ${reservation.phone}`
    );
    window.open(`https://wa.me/84378337365?text=${text}`, '_blank');
    setReservationStep('sent');
  }

  const handleSendEmail = () => {
    const subject = encodeURIComponent('New Reservation Westwood');
    const body = encodeURIComponent(
      `Name: ${reservation.name}\n` +
      `Date: ${reservation.date}\n` +
      `Time: ${reservation.time}\n` +
      `Persons: ${reservation.people}\n` +
      `Phone: ${reservation.phone}\n\nPlease confirm.`
    );
    window.open(`mailto:DEINE_EMAIL_HIER@gmail.com?subject=${subject}&body=${body}`, '_blank');
    setReservationStep('sent');
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#611A1B', 
      color: 'white', 
      paddingBottom: '80px',
      display: 'flex',
      justifyContent: 'center'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '620px',
        margin: '0 auto',
        padding: '0 1rem' 
      }}>
        
        <div style={{ maxWidth: '460px', margin: '0 auto' }}>

          {/* Hero Bild */}
          <img 
            src="/westwood-hero.png" 
            alt="Westwood Restaurant" 
            style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '0 0 16px 16px' }} 
          />

          {/* Sprachen */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', margin: '1.5rem 0' }}>
            {(['de','en','vi'] as const).map(l => (
              <button key={l} onClick={() => setLanguage(l)} 
                style={{ 
                  padding: '6px 14px', 
                  borderRadius: '9999px', 
                  background: language === l ? '#f59e0b' : '#4a1a1b', 
                  color: language === l ? '#111' : 'white' 
                }}>
                {l === 'de' && '🇩🇪'} {l === 'en' && '🇬🇧'} {l === 'vi' && '🇻🇳'}
              </button>
            ))}
          </div>

          {/* Logo + Kontakt */}
          <div style={{ textAlign: 'center' }}>
            {/* Westwood Logo (weißes Symbol) */}
            <img 
              src="/westwood-logo.png" 
              alt="Westwood Logo" 
              style={{ 
                width: '130px', 
                height: '130px', 
                marginBottom: '0.6rem',
                filter: 'brightness(1.15)'
              }} 
            />

            <h1 style={{ 
              fontSize: '2.8rem', 
              fontWeight: 'bold', 
              margin: '0 0 0.1rem 0',
              letterSpacing: '-1px'
            }}>
              Westwood
            </h1>
            <p style={{ color: '#F4F4F6', fontSize: '1rem', margin: '0 0 0.8rem 0', letterSpacing: '1px' }}>KITCHEN & BAR</p>
            <p style={{ color: '#f59e0b', fontSize: '1.1rem' }}>{t.subtitle}</p>

            <div style={{ fontSize: '1rem', color: '#ddd', lineHeight: '1.6', marginTop: '1.2rem' }}>
              <p style={{ color: '#f59e0b', cursor: 'pointer', marginBottom: '4px' }} 
                 onClick={() => window.open('https://maps.google.com/?q=68+Nguyễn+Tư+Giản,+Ngũ+Hành+Sơn,+Đà+Nẵng', '_blank')}>
                📍 68 Nguyễn Tư Giản, Ngũ Hành Sơn, Đà Nẵng
              </p>
              <p style={{ color: '#f59e0b', cursor: 'pointer', marginBottom: '4px' }} 
                 onClick={() => window.open('tel:+84378337365')}>
                📞 +84 378 337 365
              </p>
              <p style={{ color: '#f59e0b', cursor: 'pointer' }} 
                 onClick={() => window.open('https://www.instagram.com/westwood.danang', '_blank')}>
                📸 @westwood.danang
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', background: '#4a1a1b', borderRadius: '9999px', padding: '4px', margin: '2.2rem 0' }}>
            {['home', 'menu', 'reservation', 'bitictionary'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab as Tab)}
                style={{ 
                  flex: 1, 
                  padding: '12px', 
                  borderRadius: '9999px', 
                  fontWeight: '600', 
                  background: activeTab === tab ? '#f59e0b' : 'transparent', 
                  color: activeTab === tab ? '#111' : '#ddd' 
                }}>
                {tab === 'home' && t.home}
                {tab === 'menu' && t.menu}
                {tab === 'reservation' && t.reservation}
                {tab === 'bitictionary' && t.bitictionary}
              </button>
            ))}
          </div>

          {/* Menu */}
          {activeTab === 'menu' && (
            <div style={{ background: '#4a1a1b', padding: '1.5rem', borderRadius: '16px' }}>
              <h3 style={{ color: '#f59e0b', marginBottom: '1.5rem' }}>{t.menu}</h3>

              {/* Getränke */}
              <div onClick={() => setOpenCategory(openCategory === 'drinks' ? null : 'drinks')} 
                   style={{ cursor: 'pointer', padding: '12px', background: '#3a1415', borderRadius: '12px', marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                  <span>{t.drinks}</span>
                  <span>{openCategory === 'drinks' ? '−' : '+'}</span>
                </div>
                {openCategory === 'drinks' && menuDrinks.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i !== menuDrinks.length-1 ? '1px solid #5a2425' : 'none' }}>
                    <div><span style={{ marginRight: '10px' }}>{item.emoji}</span>{item.name}</div>
                    <div style={{ textAlign: 'right' }}>
                      <div>{item.priceVnd.toLocaleString()} VND</div>
                      <div style={{ color: '#f59e0b' }}>~{calculateSats(item.priceVnd)} Sats</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Essen */}
              <div onClick={() => setOpenCategory(openCategory === 'food' ? null : 'food')} 
                   style={{ cursor: 'pointer', padding: '12px', background: '#3a1415', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                  <span>{t.food}</span>
                  <span>{openCategory === 'food' ? '−' : '+'}</span>
                </div>
                {openCategory === 'food' && menuFood.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i !== menuFood.length-1 ? '1px solid #5a2425' : 'none' }}>
                    <div><span style={{ marginRight: '10px' }}>{item.emoji}</span>{item.name}</div>
                    <div style={{ textAlign: 'right' }}>
                      <div>{item.priceVnd.toLocaleString()} VND</div>
                      <div style={{ color: '#f59e0b' }}>~{calculateSats(item.priceVnd)} Sats</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reservation */}
          {activeTab === 'reservation' && (
            <div style={{ background: '#4a1a1b', padding: '1.8rem', borderRadius: '20px' }}>
              <h2 style={{ color: '#f59e0b', textAlign: 'center', marginBottom: '1.5rem' }}>{t.reservation}</h2>
              
              {reservationStep === 'sent' ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <p style={{ fontSize: '1.4rem', color: '#4ade80' }}>{t.success}</p>
                  <button onClick={() => { 
                    setReservationStep('form'); 
                    setReservation({ date: '', time: '', people: '2', name: '', phone: '' }); 
                  }} 
                    style={{ marginTop: '2rem', color: '#ddd', background: 'none', border: 'none' }}>
                    {t.newReservation}
                  </button>
                </div>
              ) : reservationStep === 'choice' ? (
                <div style={{ textAlign: 'center' }}>
                  <p style={{ marginBottom: '1.5rem', color: '#ddd', fontSize: '1.1rem' }}>{t.howToReceive}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <button onClick={handleSendWhatsApp} style={{ background: '#25D366', color: 'white', padding: '16px', borderRadius: '9999px', fontWeight: 'bold', border: 'none' }}>
                      📱 {t.whatsapp}
                    </button>
                    <button onClick={handleSendEmail} style={{ background: '#f59e0b', color: '#111', padding: '16px', borderRadius: '9999px', fontWeight: 'bold', border: 'none' }}>
                      ✉️ {t.email}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleReservationSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <input type="date" value={reservation.date} onChange={e => setReservation({...reservation, date: e.target.value})} required style={{ padding: '12px', borderRadius: '12px', background: '#3a1415', color: 'white', border: 'none' }} />
                  <input type="time" value={reservation.time} onChange={e => setReservation({...reservation, time: e.target.value})} required style={{ padding: '12px', borderRadius: '12px', background: '#3a1415', color: 'white', border: 'none' }} />
                  <select value={reservation.people} onChange={e => setReservation({...reservation, people: e.target.value})} style={{ padding: '12px', borderRadius: '12px', background: '#3a1415', color: 'white', border: 'none' }}>
                    <option value="1">1 Person</option>
                    <option value="2">2 Personen</option>
                    <option value="3">3 Personen</option>
                    <option value="4">4 Personen</option>
                    <option value="5">5+ Personen</option>
                  </select>
                  <input type="text" placeholder={language === 'de' ? "Dein Name" : language === 'en' ? "Your Name" : "Tên của bạn"} value={reservation.name} onChange={e => setReservation({...reservation, name: e.target.value})} required style={{ padding: '12px', borderRadius: '12px', background: '#3a1415', color: 'white', border: 'none' }} />
                  <input type="tel" placeholder={language === 'de' ? "Telefonnummer" : language === 'en' ? "Phone Number" : "Số điện thoại"} value={reservation.phone} onChange={e => setReservation({...reservation, phone: e.target.value})} required style={{ padding: '12px', borderRadius: '12px', background: '#3a1415', color: 'white', border: 'none' }} />
                  <button type="submit" style={{ background: '#f59e0b', color: '#111', padding: '16px', borderRadius: '9999px', fontWeight: 'bold' }}>{t.send}</button>
                </form>
              )}
            </div>
          )}

          {/* Bitictionary */}
          {activeTab === 'bitictionary' && (
            <div style={{ background: '#4a1a1b', padding: '1.5rem', borderRadius: '16px' }}>
              <h3 style={{ color: '#f59e0b', marginBottom: '1rem' }}>{t.bitictionary}</h3>
              
              <input
                type="text"
                placeholder={language === 'de' ? "Suchen..." : language === 'en' ? "Search..." : "Tìm kiếm..."}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '14px 16px', 
                  borderRadius: '12px', 
                  background: '#3a1415', 
                  color: 'white', 
                  border: 'none',
                  marginBottom: '1.5rem',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />

              {filteredTerms.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#888', padding: '3rem 1rem' }}>Kein Begriff gefunden.</p>
              ) : (
                filteredTerms.map((item, i) => (
                  <div key={i} style={{ 
                    background: '#3a1415', 
                    padding: '1.25rem', 
                    borderRadius: '12px', 
                    marginBottom: '1rem' 
                  }}>
                    <h4 style={{ color: '#f59e0b', margin: '0 0 0.8rem 0' }}>{item.term}</h4>
                    <p style={{ color: '#ddd', lineHeight: '1.55', whiteSpace: 'pre-line' }}>{item[language]}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Home */}
          {activeTab === 'home' && (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#ddd', fontSize: '1.1rem' }}>
              Welcome / Willkommen / Chào mừng bạn đến với Westwood!
            </div>
          )}

          {/* Live Daten */}
          <div style={{ marginTop: '2.5rem', background: '#4a1a1b', padding: '14px', borderRadius: '16px', textAlign: 'center', fontSize: '0.95rem' }}>
            <div>Block Height: <span style={{ color: '#f59e0b' }}>{blockHeight ? `#${blockHeight.toLocaleString()}` : 'Laden...'}</span></div>
            <div style={{ marginTop: '6px' }}>
              BTC: {btcPrice ? `$${btcPrice.usd.toLocaleString()} • €${btcPrice.eur.toLocaleString()} • ₫${(btcPrice.vnd/1000000000).toFixed(2)}B` : 'Laden...'}</div>
          </div>

          {/* Copyright */}
          <div style={{ textAlign: 'center', marginTop: '3rem', color: '#aaa', fontSize: '0.85rem' }}>
            Copyright © <span style={{ color: '#f59e0b', cursor: 'pointer' }} onClick={() => window.open('https://x.com/BitcoinZeit', '_blank')}>BitcoinZeit</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App