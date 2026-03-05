const fs = require('fs');
const content = fs.readFileSync('c:/Users/PANVI KAUSHIK/Desktop/Health123/App.tsx', 'utf8');

const newLogin = `const LoginView = ({ role, onLoginSuccess, onBack, backText = "← Back to Portal Selection" }: { role: 'patient' | 'doctor', onLoginSuccess: (email: string) => void, onBack: () => void, backText?: string }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showGoogleAuth, setShowGoogleAuth] = useState(false);

  const mockGoogleAccounts = Object.keys(localStorage)
    .filter(k => k.startsWith(\`healthlink_data_\${role}_\`))
    .map(k => k.replace(\`healthlink_data_\${role}_\`, ''));

  if (mockGoogleAccounts.length === 0) {
    mockGoogleAccounts.push(role === 'patient' ? 'new.patient@gmail.com' : 'new.doctor@gmail.com');
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidGmail(email)) {
      setError('Enter a correct email id (must end with @gmail.com)');
      return;
    }
    if (password.length !== 6) {
      setError('Enter 6-digit PIN');
      return;
    }

    const savedData = localStorage.getItem(\`healthlink_data_\${role}_\${email.toLowerCase().trim()}\`);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.password && parsed.password !== password) {
          setError('Incorrect PIN. Please try again.');
          return;
        }
      } catch (err) {
        // Proceed if parse error
      }
    }

    onLoginSuccess(email);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#F8FAFC]">
      <button onClick={onBack} className="absolute top-8 left-8 md:top-12 md:left-12 text-slate-500 hover:text-slate-900 flex items-center gap-2 font-black text-sm transition-all bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-200 z-[150] hover:-translate-x-1">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        {backText}
      </button>
      <div className="w-full max-w-md p-8 relative animate-in fade-in zoom-in duration-500">
        <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-slate-100 text-center">
          <div className={\`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl \${role === 'doctor' ? 'bg-blue-600' : 'bg-[#004D40]'}\`}>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Health Link</h2>
          <p className="text-slate-500 font-medium mb-8 capitalize">{role} Login</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              required
              type="email"
              placeholder="Email Address (@gmail.com)"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
              className={\`w-full bg-slate-50 border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 \${error && !isValidGmail(email) ? 'focus:ring-red-500' : 'focus:ring-[#004D40]'}\`}
            />
            <input
              required
              type="password"
              placeholder="6-digit PIN"
              maxLength={6}
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-[#004D40]"
            />
            {error && <p className="text-red-500 text-xs font-bold animate-pulse">{error}</p>}
            <button type="submit" className={\`w-full text-white font-bold py-4 rounded-2xl shadow-xl transition-all \${role === 'doctor' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-[#004D40] hover:bg-[#00382D]'}\`}>Sign In</button>

            <div className="relative flex items-center py-5">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-bold uppercase tracking-widest">or</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <button type="button" onClick={() => setShowGoogleAuth(true)} className="w-full bg-white text-slate-700 font-bold py-4 rounded-2xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
              Continue with Google
            </button>
          </form>

          {showGoogleAuth && (
            <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-sm rounded-[40px] flex items-center justify-center p-8 animate-in zoom-in duration-300">
              <div className="w-full text-center space-y-4">
                <h3 className="text-xl font-black text-slate-900 mb-6">Select Google Account</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto w-full px-2">
                  {mockGoogleAccounts.map(acc => (
                    <button key={acc} type="button" onClick={() => onLoginSuccess(acc)} className="w-full p-4 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 text-left flex items-center gap-4 transition-all group">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">{acc[0].toUpperCase()}</div>
                      <div className="flex-1 truncate">
                        <p className="font-black text-slate-900 text-sm truncate">{acc}</p>
                        <p className="text-xs text-slate-500">Google Account</p>
                      </div>
                    </button>
                  ))}
                  <button type="button" onClick={() => {
                    const newAcc = window.prompt("Enter your Google Account (@gmail.com):");
                    if (newAcc && newAcc.endsWith("@gmail.com")) onLoginSuccess(newAcc);
                    else if (newAcc) alert("Please use a @gmail.com account.");
                  }} className="w-full p-4 rounded-2xl border-2 border-dashed border-slate-300 hover:border-slate-400 text-slate-500 hover:text-slate-700 font-bold text-sm transition-colors text-center">
                    + Use another account
                  </button>
                </div>
                <button type="button" onClick={() => setShowGoogleAuth(false)} className="mt-6 text-slate-400 text-sm font-bold hover:text-slate-900">Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
`

let updatedContent = content.replace(/const LoginView = \(\{.*?\}\);\s*\};\s*/sm, newLogin);

fs.writeFileSync('c:/Users/PANVI KAUSHIK/Desktop/Health123/App.tsx', updatedContent);
