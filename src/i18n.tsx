import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import * as OpenCC from 'opencc-js';

export type Lang = 'zh-Hant' | 'zh-Hans';

// Converters (TW <-> CN)
const t2s = OpenCC.Converter({ from: 'tw', to: 'cn' });
const s2t = OpenCC.Converter({ from: 'cn', to: 'tw' });

const STORAGE_KEY = 'hk_qas_lang';

function getInitialLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'zh-Hans' || saved === 'zh-Hant') return saved;
  } catch {
    // ignore
  }
  return 'zh-Hant';
}

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
}

const LangContext = createContext<LangContextValue>({
  lang: 'zh-Hant',
  setLang: () => {},
});

export const useLang = () => useContext(LangContext);

/** Convert all visible text nodes under root (skips input values & placeholders). */
export function convertDomText(root: HTMLElement | null, lang: Lang) {
  if (!root) return;
  const converter = lang === 'zh-Hans' ? t2s : s2t;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  while (walker.nextNode()) {
    nodes.push(walker.currentNode as Text);
  }
  nodes.forEach((node) => {
    const parent = node.parentElement;
    if (!parent) return;
    const tag = parent.tagName;
    if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'TEXTAREA') return;
    if (parent.isContentEditable) return;
    const raw = node.nodeValue || '';
    if (!raw.trim()) return;
    const converted = converter(raw);
    if (converted !== raw) {
      node.nodeValue = converted;
    }
  });
}

export const LangProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(getInitialLang);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // ignore
    }
  }, []);

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
};

/** Hook: re-apply conversion after lang changes (both directions) and after React re-renders. */
export function useDomLangSync(ref: React.RefObject<HTMLElement | null>, deps: unknown[]) {
  const { lang } = useLang();
  const prevLang = useRef(lang);

  useEffect(() => {
    const langChanged = prevLang.current !== lang;
    if (langChanged) {
      // Direction change: convert DOM both ways (t2s when switching to simplified,
      // s2t when switching back to traditional). s2t is best-effort for
      // already-converted text; source of truth is the React-rendered traditional.
      convertDomText(ref.current, lang);
      prevLang.current = lang;
    } else if (lang === 'zh-Hans') {
      // React re-rendered (tab/data change) and restored traditional source text —
      // re-apply simplified conversion.
      convertDomText(ref.current, lang);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, ...deps]);
}
