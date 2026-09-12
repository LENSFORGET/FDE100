"""Extract the user-supplied PDF. Usage: python scripts/import-report.py /path/to/report.pdf
Requires pypdf. Curated interpretation stays in src/data/editorial.json.
"""
import json,re,sys
from pathlib import Path
from pypdf import PdfReader
ROOT=Path(__file__).resolve().parents[1]
pages=[p.extract_text() or '' for p in PdfReader(sys.argv[1]).pages]
starts=[6,14,24,33,46,56,68,77,87,96,107,120,130,137,147,159,168,180,188,199,209,218,228,236,246]
toc=''.join(pages[4:6]).replace('\n','')
titles=re.findall(r'NO\.\d+\s*(.*?)\s+\d+(?=NO\.|[45]/245|$)',toc)
assert len(titles)==24,(len(titles),toc)
editorial=json.loads((ROOT/'src/data/editorial.json').read_text())
questions=['业务场景与问题','原来的解决方式','方案与实施步骤','实际效果','挑战与应对','落地经验']
result=[]
for i,c in enumerate(editorial):
    source=[{'pdfPage':p+1,'printedPage':p,'text':re.sub(r'\n?\d+/245\s*$', '',pages[p]).strip()} for p in range(starts[i]+1,starts[i+1])]
    text='\n'.join(p['text'] for p in source)
    matches=list(re.finditer(r'Q\s*([1-6])[：:]',text))
    assert len(matches)==6,(i,len(matches))
    qa=[]
    for j,m in enumerate(matches):
        raw=text[m.end():matches[j+1].start() if j+1<len(matches) else len(text)].strip()
        raw=raw.replace('\\+','+').replace('\\-','-').replace('\\.','.')
        body=raw.split('？',2 if j in (0,4) else 1)[-1].strip()
        paras=re.split(r'(?<=[。！？：])\n',body)
        paras=[p.replace('\n','') for p in paras if p.strip()]
        original_page=next(p['pdfPage'] for p in source if re.search(r'Q\s*'+str(j+1)+r'[：:]',p['text']))
        qa.append({'number':j+1,'title':questions[j],'paragraphs':paras,'pdfPage':original_page})
    result.append({**c,'id':i+1,'reportTitle':titles[i],'printedStart':starts[i],'printedEnd':starts[i+1]-1,'pdfStart':starts[i]+1,'pdfEnd':starts[i+1],'qa':qa})
(ROOT/'src/data/cases.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print('Imported',len(result),'cases;',sum(len(c['qa']) for c in result),'Q&A sections')
