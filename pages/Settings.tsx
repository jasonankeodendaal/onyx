import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { getStoredConfig, saveConfig } from '../services/supabaseClient';
import { CheckCircle, AlertCircle, Shield, Zap, Upload } from '../components/Icons';

const Settings: React.FC = () => {
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');

  useEffect(() => {
    const config = getStoredConfig();
    if (config) {
      setUrl(config.url);
      setKey(config.key);
    }
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split('\n');
      let foundUrl = '';
      let foundKey = '';

      lines.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;

        const [key, ...values] = trimmed.split('=');
        const value = values.join('=').trim().replace(/^["']|["']$/g, ''); // Remove surrounding quotes
        const upperKey = key.trim().toUpperCase();

        if (upperKey.includes('SUPABASE_URL')) foundUrl = value;
        if ((upperKey.includes('SUPABASE_KEY') || upperKey.includes('SUPABASE_ANON_KEY')) && !upperKey.includes('SERVICE_ROLE')) foundKey = value;
      });

      if (foundUrl) setUrl(foundUrl);
      if (foundKey) setKey(foundKey);
      
      if (foundUrl || foundKey) {
        setTestStatus('success'); 
        setTestMessage(`Configuration loaded from ${file.name}`);
      } else {
        setTestStatus('error');
        setTestMessage('No Supabase URL or Key found in this file.');
      }
    };
    reader.readAsText(file);
    // Reset input value so same file can be selected again if needed
    e.target.value = '';
  };

  const testConnection = async () => {
    if (!url || !key) {
      setTestStatus('error');
      setTestMessage('Please enter both URL and API Key.');
      return;
    }

    setTestStatus('testing');
    setTestMessage('');

    try {
      // 1. Validate URL Syntax
      try {
        new URL(url);
      } catch {
        throw new Error('Invalid URL format. Must start with https://');
      }

      // 2. Attempt Connection
      const tempClient = createClient(url, key);
      const { error } = await tempClient.from('sites').select('count', { count: 'exact', head: true });

      // 3. Handle specific errors
      if (error) {
        // 42P01 means table missing, but AUTH IS VALID. This is success for connection.
        if (error.code === '42P01') {
           setTestStatus('success');
           setTestMessage('Connection Successful! (Tables not created yet, which is fine)');
           return;
        }
        // 401 means auth failed
        if (error.code === '401' || error.message.includes('JWT')) {
           throw new Error('Authentication failed. Check your Anon Key.');
        }
        // Other errors
        throw error;
      }

      setTestStatus('success');
      setTestMessage('Connection established successfully.');
    } catch (e: any) {
      setTestStatus('error');
      setTestMessage(e.message || 'Failed to connect to Supabase.');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (testStatus === 'success' || confirm("Connection not tested. Save anyway?")) {
      saveConfig(url, key);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 animate-fade-in">
      <h1 className="text-3xl font-serif text-white mb-2">System Configuration</h1>
      <p className="text-gray-500 mb-8">Establish a secure link to your data sovereignty engine.</p>
      
      <div className="bg-onyx-900 rounded-xl border border-onyx-800 p-8 shadow-xl">
        <div className="flex justify-between items-start mb-6">
            <div className="flex items-start gap-4 p-4 bg-blue-900/10 border border-blue-900/30 rounded-lg max-w-xl">
                <Shield className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                    <h3 className="text-sm font-medium text-blue-300">Credentials Required</h3>
                    <p className="text-xs text-blue-400/70 mt-1 leading-relaxed">
                    Navigate to your <strong>Supabase Project Settings &gt; API</strong>. 
                    Copy the <code>Project URL</code> and the <code>anon public</code> key. 
                    These keys are stored locally on your device.
                    </p>
                </div>
            </div>

            <div>
                <input
                    type="file"
                    id="env-upload"
                    accept=".env, .txt"
                    className="hidden"
                    onChange={handleFileUpload}
                />
                <label 
                    htmlFor="env-upload" 
                    className="flex items-center gap-2 px-4 py-2 bg-onyx-800 hover:bg-onyx-700 text-gray-300 text-xs font-medium rounded-lg cursor-pointer border border-onyx-700 transition-colors whitespace-nowrap"
                >
                    <Upload className="w-3 h-3" />
                    Import .env
                </label>
            </div>
        </div>
        
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Project URL</label>
            <input 
              type="text" 
              value={url}
              onChange={e => { setUrl(e.target.value); setTestStatus('idle'); }}
              placeholder="https://xyz.supabase.co"
              className="w-full px-4 py-3 bg-black border border-onyx-700 rounded-lg text-white focus:outline-none focus:border-white transition-colors font-mono text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Anon Public Key</label>
            <div className="relative">
              <input 
                type="password" 
                value={key}
                onChange={e => { setKey(e.target.value); setTestStatus('idle'); }}
                placeholder="eyJh..."
                className="w-full px-4 py-3 bg-black border border-onyx-700 rounded-lg text-white focus:outline-none focus:border-white transition-colors font-mono text-sm pr-10"
              />
              <div className="absolute right-3 top-3 text-gray-600">
                <Zap className="w-4 h-4" />
              </div>
            </div>
          </div>
          
          {/* Test Result Display */}
          {testStatus !== 'idle' && (
            <div className={`p-4 rounded-lg flex items-center gap-3 text-sm ${
              testStatus === 'success' ? 'bg-green-900/20 text-green-400 border border-green-900/50' : 
              testStatus === 'testing' ? 'bg-gray-800 text-gray-300' :
              'bg-red-900/20 text-red-400 border border-red-900/50'
            }`}>
              {testStatus === 'success' && <CheckCircle className="w-4 h-4" />}
              {testStatus === 'error' && <AlertCircle className="w-4 h-4" />}
              {testStatus === 'testing' && <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
              <span>{testMessage || 'Testing connection...'}</span>
            </div>
          )}

          <div className="pt-6 flex items-center justify-between border-t border-onyx-800">
            <button 
              type="button"
              onClick={testConnection}
              disabled={!url || !key || testStatus === 'testing'}
              className="text-gray-400 hover:text-white transition-colors text-sm font-medium disabled:opacity-50"
            >
              Verify Connection
            </button>
            <button 
              type="submit"
              disabled={!url || !key || testStatus === 'testing'} 
              className="bg-white text-black px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;