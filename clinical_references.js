/**
 * Clinical Microbiology References & TCVGH SOP Pearls
 * Path: web/data/clinical_references.js
 */

window.CLINICAL_REFS = {
  sops: [
    {
      id: "ML-SIP-020",
      title: "ML-SIP-020 印度墨染色標準檢驗程序",
      dept: "臨床病理檢驗部 微生物科",
      purpose: "利用負染色法快速檢測腦脊髓液 (CSF) 或體液檢體中之新型隱球菌 (Cryptococcus neoformans)。",
      principle: "印度墨 (India ink) 無法穿透新型隱球菌外層厚多醣莢膜 (Polysaccharide capsule)，在暗黑色墨汁顆粒背景下，菌體顯現清晰透明亮光暈 (Halo)。",
      steps: [
        "離心 CSF 檢體 (1500 rpm, 10-15 分鐘) 濃縮菌體。",
        "取一滴沉澱物置於潔淨玻片中央。",
        "加入一滴等量印度墨染液，以接種環或蓋玻片輕輕混勻。",
        "覆蓋蓋玻片，避免氣泡產生。",
        "於低倍鏡 (10X) 尋找可疑區域，轉高倍鏡 (40X) 仔細確認菌體與光暈大小。"
      ],
      interpretation: "陽性：黑色背景中見圓形或卵圓形出芽酵母細胞 (直徑 4-10 μm)，周圍環繞均勻透亮之寬大莢膜光暈 (寬度可達 3-5 倍菌體直徑)，常見狹窄基底出芽 (Narrow-based budding)。\n注意：需與白血球、紅血球、脂肪球鑑別；白血球邊緣不整且內部有細胞核特徵，無真正透亮均勻莢膜。",
      qc: "陽性品管菌株：Cryptococcus neoformans (ATCC 90112)；陰性對照：Candida albicans (ATCC 90028)。"
    },
    {
      id: "ML-SIP-021",
      title: "ML-SIP-021 真菌染色（10% KOH）標準檢驗程序",
      dept: "臨床病理檢驗部 微生物科",
      purpose: "用於皮屑、指甲屑、毛髮、皮下組織及深部組織檢體之真菌菌絲與孢子快速篩檢。",
      principle: "10% 氫氧化鉀 (KOH) 為強鹼，能迅速溶解人體組織角蛋白 (Keratin)、黏蛋白與宿主細胞，但真菌細胞壁含幾丁質 (Chitin) 與葡聚醣可耐受 KOH，使背景透明化凸顯真菌結構。",
      steps: [
        "取適量檢體 (刮取之皮屑、碎甲片或組織剪碎) 置於玻片上。",
        "滴加 1-2 滴 10% KOH 溶液 (或含 Parker blue/Calcofluor white 之螢光 KOH 染液)。",
        "蓋上蓋玻片，於酒精燈火焰上方輕微溫熱 (勿煮沸，防止產生 KOH 針狀結晶偽影)。",
        "靜置 10-15 分鐘讓角蛋白充分軟化溶解 (厚甲片可延長至 30-60 分鐘)。",
        "先以 10X 掃描，40X 觀察菌絲分節、分支角度 (45° vs 90°) 及關節孢子。"
      ],
      interpretation: "陽性：見透明具折光性、有隔/無隔菌絲、關節孢子 (Arthroconidia) 或出芽酵母細胞。\n偽陽性鑑別：膽固醇結晶 (Mosaic fungus) 與棉花纖維易被誤判，真菌菌絲粗細均勻且具隔板與分支。",
      qc: "每月或更換試劑時，以 Trichophyton mentagrophytes 菌絲進行功能驗證。"
    },
    {
      id: "ML-SIP-024",
      title: "ML-SIP-024 臨床黴菌培養與鑑定標準檢驗程序",
      dept: "臨床病理檢驗部 微生物科",
      purpose: "規範深部真菌、淺部皮癬菌及雙形性致病真菌之臨床分離、純化與鑑定標準流程。",
      principle: "依據真菌對營養、抗生素耐受性與生長溫度之特性，使用選擇性與鑑別性培養基組合進行分離。",
      media: [
        "SDA (Sabouraud Dextrose Agar, pH 5.6)：真菌常規基礎培養基，酸性抑制一般細菌。",
        "Mycosel Agar / Mycobiotic Agar：含 Chloramphenicol (抑細菌) 及 Cycloheximide (抑腐生黴菌)，專門分離皮癬菌與雙形性真菌。(注意：Cryptococcus 與 Aspergillus 對 Cycloheximide 敏感，會被抑制！)",
        "BHI with blood (腦心浸體含血培養基)：滋養性高，用於深部組織、骨髓之雙形性真菌分離。",
        "Chromagar Candida：顯色培養基，依菌落顏色快速鑑別 Candida albicans (綠色)、C. tropicalis (藍金屬色)、C. krusei (粉紅毛絨)、C. glabrata (紫褐色)。"
      ],
      incubation: "常規培養於 28-30°C (皮屑/深部真菌) 至少觀察 4 週；雙形性真菌需於 25°C (黴菌態) 與 37°C (酵母態) 雙溫對照培養。",
      qc: "每次批次檢驗需測試 ATCC 標準菌株之生長性與選擇性。"
    }
  ],

  ast: [
    {
      title: "CLSI 感受性試驗原則與操作規範 (林進福老師講義重點)",
      content: [
        {
          heading: "1. 紙錠擴散法 (Kirby-Bauer Disk Diffusion Method)",
          details: [
            "菌液濃度：嚴格調配至 0.5 McFarland (約 1.5 × 10^8 CFU/mL)。太濃抑菌圈變小 (偽抗藥)；太稀抑菌圈變大 (偽敏感)。",
            "培養基規格：Mueller-Hinton Agar (MHA)，瓊脂厚度必須為 4.0 ± 0.5 mm (約 25 mL/9cm 培養皿)。厚度 > 4mm 擴散慢致抑菌圈偏小；厚度 < 4mm 抑菌圈偏大。",
            "培養條件：35 ± 2°C，空氣環境孵育 16-18 小時 (葡萄球菌與腸球菌 vancomycin 需滿 24 小時)。",
            "抑菌圈判讀：使用尺或卡尺量取完全無菌落生長之直徑 (mm)，對照 CLSI M100 每年更新標準 (S, I, SDD, R)。"
          ]
        },
        {
          heading: "2. 最低抑菌濃度 (MIC, Minimum Inhibitory Concentration)",
          details: [
            "定義：在體外能完全抑制肉眼可見細菌生長之最低抗微生物製劑濃度 (μg/mL)。",
            "標準參考法：肉湯微量稀釋法 (Broth Microdilution, BMD) 及 瓊脂稀釋法 (Agar Dilution)。",
            "梯度擴散法 (E-test)：塑膠試條含連續預設抗生素梯度，橢圓形抑菌帶切點即為 MIC 值。"
          ]
        },
        {
          heading: "3. 臨床重大特殊抗藥性檢驗 (High-Yield Pearls)",
          details: [
            "D-test (誘導性 Clindamycin 抗藥性)：檢測 Staphylococcus/Streptococcus 攜帶 erm 基因 (紅黴素誘導 methylase)。將 Erythromycin (15μg) 與 Clindamycin (2μg) 相距 15-26 mm 放置，若 Clindamycin 抑菌圈靠近 Erythromycin 側出現扁平 D 字型，報告為 Clindamycin Resistant！",
            "MRSA 檢測：mecA 基因編碼 PBP2a (對所有 beta-lactams 包括 carbapenems 親和力極低)。篩檢首選 Cefoxitin disk (比 oxacillin 更敏感且強效誘導 mecA)。",
            "ESBL (超廣效乙內醯胺酶)：常見於 E. coli, K. pneumoniae。雙紙錠確認試驗利用 Ceftazidime 或 Cefotaxime 單獨 vs 合併 Clavulanic acid，若合併組抑菌圈擴大 ≥ 5 mm 即判定為 ESBL (+)。",
            "CRE (抗碳青黴烯腸道菌)：產生 KPC, NDM, OXA-48, IMP 等 carbapenemase。改良 Carbapenem 不活化試驗 (mCIM) 與 EDTA-CIM (eCIM) 可區分 Serine carbapenemase 與 Metallo-beta-lactamase (MBL)。",
            "VRE (抗萬古黴素腸球菌)：vanA (高抗 Vancomycin & Teicoplanin, 由轉位子 Tn1546 攜帶)；vanB (抗 Vancomycin, 但對 Teicoplanin 敏感)；vanC (E. gallinarum/casseliflavus 染色體內生低度抗藥，不具院內傳播性)。"
          ]
        }
      ]
    }
  ],

  maldi_ms: [
    {
      title: "VITEK MS PRIME 微生物質譜鑑定系統與 NTM 流程",
      principles: [
        "質譜儀原理：MALDI-TOF (Matrix-Assisted Laser Desorption/Ionization Time-of-Flight)。",
        "基質 (Matrix)：常用 α-Cyano-4-hydroxycinnamic acid (HCCA)，吸收 337nm 氮雷射能量，協助細菌核糖體蛋白質脫附並形成單電荷陽離子 [M+H]+。",
        "飛行時間管 (Flight Tube)：真空電場加速離子，質荷比 (m/z) 小、質量輕的離子飛得快先抵達偵測器；質量大的離子飛得慢後抵達。",
        "鑑定比對：以 2,000 - 20,000 Da 之核糖體蛋白質圖譜與內建巨量資料庫比對，輸出信賴度分數 (Confidence value 99.9%)。"
      ],
      ntm_procedure: [
        "1. 滅活與脫脂：取菌體加入 70% 乙醇，劇烈震盪滅活並去除外層厚分枝菌酸 (Mycolic acid) 脂質。",
        "2. 珠磨破壁 (Bead-beating)：加入鋯珠/玻璃珠，於破壁機高速振盪，徹底粉碎厚細胞壁釋放蛋白質。",
        "3. 萃取：加入 70% 甲酸 (Formic acid) 溶解沉澱蛋白，再加入 100% 乙腈 (Acetonitrile) 離心取上清液。",
        "4. 上靶點樣：取 1 μL 上清液滴於靶盤 spot，風乾後覆蓋 1 μL HCCA matrix 即可進行質譜掃描。"
      ]
    }
  ],

  mycology_guide: [
    {
      genus: "Aspergillus (麴菌屬)",
      hyphae: "透明、有隔菌絲，呈 45 度角銳角二分叉分支 (Dichotomous branching)。",
      conidiophore: "分生孢子柄末端膨大形成囊泡 (Vesicle)，囊泡上排列單層或雙層瓶狀體 (Phialides)，產生串珠狀分生孢子。",
      species: "A. fumigatus (煙燻綠色，單層 phialides，最常見侵襲性感染)；A. flavus (黃綠色，產生黃麴毒素 Aflatoxin)；A. niger (黑色放射狀大頭，雙層 phialides)；A. terreus (肉桂褐色，對 Amphotericin B 天生具抗藥性！)"
    },
    {
      genus: "Dermatophytes (皮癬菌三大屬鑑別)",
      hyphae: "透明有隔菌絲，寄生於角蛋白組織 (皮膚、指甲、毛髮)。",
      conidiophore: "三大屬依大/小分生孢子形態鑑別：\n1. Microsporum：大分生孢子極多、粗糙厚壁、紡錘形多室；小分生孢子少。(M. canis 貓狗皮癬、M. gypseum 土壤皮癬)\n2. Trichophyton：小分生孢子大量 (圓形/淚滴狀/葡萄串狀)；大分生孢子少且薄壁鉛筆狀。(T. rubrum 培養皿背面深紅，水解尿素陰性；T. mentagrophytes 穿毛試驗陽性，尿素陽性)\n3. Epidermophyton：大分生孢子光滑薄壁、海狸尾狀/棍棒狀 2-4 室；完全無小分生孢子！(E. floccosum 絮狀表皮癬菌)"
    },
    {
      genus: "Dimorphic Fungi (地方性雙形性真菌)",
      hyphae: "25°C 呈黴菌菌絲態 (具感染性傳播孢子)；37°C 體內呈酵母態 (Yeast phase)。",
      conidiophore: "1. Histoplasma capsulatum：25°C 粗糙齒輪狀大分生孢子 (Tuberculate macroconidia)；37°C 巨噬細胞內微小卵圓酵母 (2-4 μm)。\n2. Blastomyces dermatitidis：37°C 寬基底出芽厚壁酵母 (Broad-based budding yeast, 8-15 μm)。\n3. Coccidioides immitis：25°C 桶狀關節孢子 (Barrel-shaped arthroconidia)；37°C 體內形成內含無數內生孢子之厚壁球體 (Spherule with endospores)。\n4. Paracoccidioides brasiliensis：37°C 舵輪狀多發性出芽 (Mariner's wheel appearance)。\n5. Sporothrix schenckii：25°C 梅花狀/雛菊狀排列分生孢子 (Daisy-head)；37°C 雪茄狀酵母 (Cigar-shaped yeast)。\n6. Talaromyces (Penicillium) marneffei：25°C 產生擴散性水溶性紅色素；37°C 細胞內分裂繁殖 (Transverse fission) 之酵母。"
    },
    {
      genus: "Zygomycetes / Mucorales (接合菌/毛黴目)",
      hyphae: "寬大粗細不均、無隔菌絲 (Aseptate ribbon-like hyphae)，呈 90 度直角分支。",
      conidiophore: "孢子囊柄 (Sporangiophore) 頂端形成球形孢子囊 (Sporangium)，內生孢子囊孢子 (Sporangiospores)。\n鑑別假根 (Rhizoids)：Rhizopus (假根正好長在孢子囊柄基部節點 Node)；Absidia/Lichtheimia (假根長在兩柄之間 Internode)；Mucor (完全無假根)。"
    }
  ],

  antifungal_drugs: [
    {
      class: "Polyenes (多烯類)",
      drugs: "Amphotericin B, Nystatin",
      target: "與真菌細胞膜上的麥角固醇 (Ergosterol) 緊密結合，在細胞膜上形成孔洞造成離子外漏導致細胞死亡。",
      resistance: "ERG3 或 ERG11 突變導致膜上麥角固醇含量減少 (如 Aspergillus terreus 天生耐藥)。"
    },
    {
      class: "Azoles (唑類)",
      drugs: "Fluconazole, Itraconazole, Voriconazole, Posaconazole, Isavuconazole",
      target: "抑制 14-α-demethylase (由 ERG11/CYP51 基因編碼)，阻斷 Lanosterol 轉化為 Ergosterol，導致有毒固醇中間物堆積並破壞膜結構。",
      resistance: "ERG11 基因點突變、ERG11 過度表現、CDR1/CDR2/MDR1 外排幫浦 (Efflux pumps) 上調。"
    },
    {
      class: "Echinocandins (棘白菌素類)",
      drugs: "Caspofungin, Micafungin, Anidulafungin",
      target: "非競爭性抑制 (1,3)-β-D-glucan synthase (由 FKS1, FKS2 基因編碼)，阻斷真菌細胞壁 β-葡聚醣合成，導致滲透壓裂解。",
      resistance: "FKS1 / FKS2 基因之熱點區域 (Hotspot regions) 突變。"
    },
    {
      class: "Pyrimidines (嘧啶類似物)",
      drugs: "Flucytosine (5-FC)",
      target: "經胞嘧啶通透酶 (Cytosine permease) 進入真菌細胞，被胞嘧啶去胺酶 (Cytosine deaminase) 轉化為 5-FU，進一步轉化為 5-FdUMP 抑制胸腺嘧啶合成酶，阻斷 DNA 與 RNA 合成。",
      resistance: "FCY1 (胞嘧啶去胺酶) 或 FCY2 (通透酶) 基因突變，常與 Amphotericin B 合併使用以防快速產生耐藥性。"
    },
    {
      class: "Allylamines (丙烯胺類)",
      drugs: "Terbinafine (療黴舒)",
      target: "抑制 Squalene epoxidase (由 ERG1 編碼)，阻斷角鯊烯環氧化反應，導致角鯊烯蓄積產生毒性並使麥角固醇缺乏。"
    },
    {
      class: "Mitotic Inhibitors (有絲分裂抑制劑)",
      drugs: "Griseofulvin (灰黃黴素)",
      target: "與微管蛋白 (Tubulin) 結合，破壞有絲分裂紡錘體微管形成，抑制真菌細胞分裂。"
    }
  ]
,
// ==========================================
  // 臨床生物化學核心精要與實證 SOP (TCVGH Pearls)
  // ==========================================
  biochem_sops: [
    {
      id: "BC-SOP-001",
      title: "生化檢體採集規範與重大分析前干擾 (H-I-L Index) 處置",
      dept: "臨床病理檢驗部 生化科",
      purpose: "規範各類抗凝劑採血管適用範疇，並建立溶血 (Hemolysis)、黃疸 (Icterus)、乳糜 (Lipemia) 之系統性校驗與干擾排除機制。",
      principles: [
        "綠頭管 (Heparin 鋰鹽/鈉鹽)：活化 Antithrombin III，為急件生化與血氣分析最標準抗凝劑。",
        "紫頭管 (EDTA)：強力螯合 Ca2+, Mg2+ 等二價金屬，嚴禁測 Ca2+, Mg2+, ALP (鋅依賴酵素)；含高濃度 K+ 亦嚴禁測鉀離子。",
        "灰頭管 (NaF)：氟化鈉專一性抑制烯醇化酶 (Enolase)，阻斷紅血球體外糖解消耗，為血糖與血乳酸專用管。",
        "溶血干擾：RBC 內 K+ (高20-30倍)、LDH (高150-200倍)、AST (高10-15倍) 大量釋出致假性飆高；游離血紅素於 415/540/575 nm 吸收干擾比色。",
        "乳糜干擾與排擠效應：TG > 1500 mg/dL 或高蛋白時，間接 ISE (Indirect ISE, 需稀釋) 會將固相體積計入致『假性低血鈉』；必須改用直接 ISE (Direct ISE, 免稀釋) 或超速離心澄清。"
      ],
      actions: "檢體 H-I-L 指數超標時，系統自動阻斷出報告並提示退件重新採檢或註記干擾程度。"
    },
    {
      id: "BC-SOP-002",
      title: "IFCC 臨床酵素連續監測法 (340 nm 偶聯動力學) 作業程序",
      dept: "臨床病理檢驗部 生化科",
      purpose: "標準化測定血清中 AST, ALT, CK, LDH, ALP 之催化活性，確保測定在零級動力學 (Zero-order kinetics) 條件下進行。",
      principles: [
        "測定條件：受質濃度飽和 ([S] ≧ 10~20 Km)，反應速率僅與酵素活性成正比；在 37°C 恆溫槽中連續記錄吸光差 (ΔA/min)。",
        "AST (GOT)：天門冬胺酸轉胺生成草醯乙酸，經 MDH (蘋果酸去氫酶) 催化消耗 NADH，於 340 nm 測量吸光度下降速率。試劑必須添加維生素 B6 (PLP) 活化 Apo-AST。",
        "ALT (GPT)：丙胺酸轉胺生成丙酮酸，經 LDH 催化消耗 NADH，於 340 nm 測量吸光度下降速率。",
        "CK：磷酸肌酸經 CK 生成 ATP，再經 Hexokinase/G6PD 偶聯反應生成 NADPH，於 340 nm 測量吸光度上升速率。添加 NAC 活化活性硫基 (-SH)。",
        "ALP：4-NPP 在 pH 10.4 (AMP 緩衝液) 下水解生成黃色 4-Nitrophenoxide，於 405 nm 直接測量吸光度上升率。"
      ],
      actions: "若反應吸光度迅速耗盡 (Substrate exhaustion)，儀器警示非線性，自動啟動生理食鹽水稀釋後重測。"
    },
    {
      id: "BC-SOP-003",
      title: "高陰離子間隙代謝性酸中毒 (Anion Gap) 與血液氣體分析評估",
      dept: "臨床病理檢驗部 生化科 / 急診檢驗室",
      purpose: "利用電解質與動脈血氣分析，快速鑑別代謝性/呼吸性酸鹼失衡、代償狀態與潛在致命中毒毒物。",
      principles: [
        "陰離子間隙公式：AG = [Na+] - ([Cl-] + [HCO3-])，正常參考區間為 8 ~ 16 mmol/L。",
        "高 AG 代謝性酸中毒口訣 MUDPILES：甲醇 (Methanol)、尿毒 (Uremia)、糖尿病酮酸 (DKA)、水楊酸 (Salicylate)、乳酸 (Lactate)、乙二醇 (Ethylene glycol)。",
        "正常 AG (高血氯性) 代謝性酸中毒：腹瀉流失鹼液、腎小管酸中毒 (RTA)。",
        "血氧解離曲線 (ODC) 左右移：左移 (親和力高不放氧：鹼中毒、低溫、低 2,3-BPG、COHb、MetHb)；右移 (容易放氧：酸中毒 Bohr effect、高溫、高 2,3-BPG)。",
        "採檢須知：動脈血氣分析必須使用專用肝素針筒，排空氣泡後立即封口，冰浴於 30 分鐘內完成上機檢測。"
      ],
      actions: "pH < 7.20 或 > 7.60、K+ < 2.5 或 > 6.5 mmol/L 觸發檢驗危急值 (Critical Value)，立即 15 分鐘內電話通報病房醫師。"
    },
    {
      id: "BC-SOP-004",
      title: "血清蛋白電泳 (SPEP) 與免疫固定電泳 (IFE) 臨床判讀指引",
      dept: "臨床病理檢驗部 生化科",
      purpose: "藉由瓊脂糖凝膠或毛細管電泳，精準分型多發性骨髓瘤單株免疫球蛋白 (M-protein) 及各類重大器質性疾病圖譜。",
      principles: [
        "pH 8.6 電泳五大區帶：Albumin (泳動最快)、α1、α2、β、γ-球蛋白 (泳動最慢)。",
        "腎病症候群：Albumin 大量漏失急降，大分子量 α2-Macroglobulin 代償劇增形成高聳尖峰。",
        "肝硬化：Albumin 下降，腸源性多株 IgA 增生造成 β 與 γ 區帶相連無谷底，形成典型『β-γ 橋接 (Bridging)』。",
        "多發性骨髓瘤：γ 或 β 區出現對稱尖銳之 M-spike；需立即以抗 IgG, IgA, IgM, κ, λ 抗血清進行 IFE 確立單株重鏈與輕鏈型態。",
        "α1-Antitrypsin 缺乏：α1 區帶完全扁平消失，臨床好發早發性肺氣腫與肝硬化。"
      ],
      actions: "初次檢出 M-protein 陽性檢體，系統自動保留檢體並建議臨床加驗血清/尿液游離輕鏈 (Free Light Chain, FLC)。"
    },
    {
      id: "BC-SOP-005",
      title: "血糖檢驗 (HK法/GOD法) 與糖尿病急慢性監測指標解析",
      dept: "臨床病理檢驗部 生化科",
      purpose: "規範己糖激酶參考法、糖化血色素 HPLC 測定與糖尿病酮酸中毒 (DKA) 鑑別重點。",
      principles: [
        "己糖激酶法 (HK 法)：國際參考法，利用 HK 與 G6PD 偶聯反應於 340 nm 測量 NADPH 生成，專一性極高不受維生素 C 干擾。",
        "GOD-POD (Trinder 法)：葡萄糖氧化酶生成 H2O2，再經 POD 呈色；高劑量維生素 C 或膽紅素會競爭 H2O2 造成假性偏低。",
        "HbA1c：反映過去 2-3 個月平均血糖水準，陽離子交換 HPLC 依電荷洗脫。溶血性貧血致紅血球壽命縮短會造成假性偏低。",
        "果糖胺 (Fructosamine)：反映過去 2-3 週血糖水準，白蛋白半衰期短，適用於妊娠糖尿病監測與變異血紅素患者。",
        "DKA 酮體檢驗避坑：人體酮體主體為 β-羥基丁酸 (78%)，尿試紙法僅測乙醯乙酸 (20%)；丙酮 (Acetone) 為中性分子不解離 H+，與酸中毒無關。"
      ],
      actions: "空腹血糖 ≧ 126 mg/dL 或 HbA1c ≧ 6.5% 為糖尿病診斷標準；血糖 > 500 mg/dL 或 < 50 mg/dL 列為急診危急值。"
    }
  ],

  physiology_sops: [
    {
      id: "PHY-SOP-001",
      title: "12 導極心電圖 (12-Lead ECG) 標準操作與解剖定位程序",
      dept: "臨床檢驗醫學中心 生理檢查室 / 心臟血管中心",
      purpose: "規範 12 導極心電圖標準安放位置、Einthoven 定律與急性心肌梗塞導極定位判讀。",
      principles: [
        "肢體導極：Lead I (RA -> LA), Lead II (RA -> LL), Lead III (LA -> LL)；Einthoven 定律：Lead II = Lead I + Lead III。右腳 (RL) 永遠為地線端。",
        "胸前導極解剖定位：V1 (胸骨右緣第4肋間)、V2 (胸骨左緣第4肋間)、V3 (V2與V4中點)、V4 (左鎖骨中線第5肋間)、V5 (左腋前線平V4)、V6 (左腋中線平V4)。",
        "心電軸判定：Lead I 與 aVF 向上為正常電軸；Lead I 向上、aVF 向下為電軸左偏 (LAD)；Lead I 向下、aVF 向上為電軸右偏 (RAD)。",
        "冠狀動脈阻塞解剖對應：下壁梗塞 (II, III, aVF ➔ 右冠動脈 RCA)；前間隔 (V1, V2 ➔ 左前降支 LAD)；前壁 (V3, V4 ➔ LAD)；側壁 (I, aVL, V5, V6 ➔ 左迴旋支 LCx)。"
      ],
      actions: "若 V1-V3 出現 ST 顯著抬高，懷疑下壁或右心室心梗，加做右胸導極 (V3R, V4R) 與後壁導極 (V7-V9)；右室心梗患者嚴禁使用硝化甘油以防致命低血壓。"
    },
    {
      id: "PHY-SOP-002",
      title: "腦電圖 (EEG) 國際 10-20 系統安放與誘發試驗指引",
      dept: "臨床檢驗醫學中心 神經內科檢查室 / 腦波室",
      purpose: "規範頭皮腦電圖電極安裝位置標準、四大基礎生理波頻與癲癇異常放電判讀。",
      principles: [
        "國際 10-20 系統基準點：鼻根 (Nasion)、枕外隆凸 (Inion)、雙耳前點 (Preauricular points)；左側為奇數 (1, 3, 5, 7)、右側為偶數 (2, 4, 6, 8)、中線為 Z (Fz, Cz, Pz)。",
        "四大正常波頻：δ波 (0.5-3.5 Hz, 深睡)、θ波 (4-7.5 Hz, 淺睡/困倦)、α波 (8-13 Hz, 正常成人清醒閉眼放鬆於枕葉最強，睜眼或心算出現 α-阻斷)、β波 (14-30 Hz, 緊張/額葉/BZD藥物作用)。",
        "癲癇樣放電：棘波 (Spike, 20-70 ms)、尖波 (Sharp wave, 70-200 ms)；失神性癲癇典型表現為全腦對稱 3 Hz 棘慢複合波 (Spike-and-wave)。",
        "三大誘發試驗：過度換氣 (HV 深快呼吸 3 分鐘誘發失神發作)、間歇閃光刺激 (IPS 誘發光敏感癲癇)、睡眠剝奪 (誘發顳葉癲癇)。"
      ],
      actions: "檢查中若突發臨床癲癇重積狀態 (Status Epilepticus)，立即維持呼吸道暢通，側臥防誤吸，通報急救團隊並給予抗癲癇藥物。"
    },
    {
      id: "PHY-SOP-003",
      title: "肺功能測試 (PFT) 與通氣障礙分類診斷程序",
      dept: "臨床檢驗醫學中心 胸腔內科檢查室 / 肺功能室",
      purpose: "利用肺量計與一氧化碳瀰散量 (DLCO)，精準鑑別阻塞型 vs 侷限型通氣障礙與氣喘可逆反應。",
      principles: [
        "肺量計無法直接測得之容量：殘氣量 (RV)、功能性殘氣量 (FRC)、肺總量 (TLC)；需改用氦氣稀釋法或體箱計測量。",
        "阻塞性肺疾 (COPD、氣喘)：FEV1/FVC < 70%；氣喘支氣管擴張劑可逆試驗 FEV1 改善 > 12% 且絕對值增加 > 200 mL。",
        "侷限性肺疾 (肺纖維化、脊椎側彎)：FEV1/FVC 正常或偏高，但 TLC 顯著低下 (< 80% 預測值)，FVC 同步等比例下降。",
        "DLCO 瀰散量：肺氣腫與肺纖維化因肺泡微血管膜破壞 DLCO 顯著下降；單純氣喘患者 DLCO 正常或輕度偏高。"
      ],
      actions: "測試過程受檢者呼氣時間必須 ≧ 6 秒且維持平台期至少 1 秒，重複 3 次最佳曲線 FVC 與 FEV1 差異需 ≦ 150 mL。"
    }
  ],

  hematology_sops: [
    {
      id: "HEM-SOP-001",
      title: "骨髓穿刺與切片評估及普魯士藍鐵染色標準程序",
      dept: "臨床檢驗醫學中心 血液腫瘤科 / 臨床血液檢驗室",
      purpose: "規範骨髓細胞豐富度計算、粒紅比值 (M:E ratio) 評估與鐵母細胞貧血鑑別。",
      principles: [
        "穿刺部位：成人首選後腸骨脊 (PSIS)；嬰幼兒為脛骨前上緣；胸骨 (Sternum) 僅限抽取嚴禁切片。",
        "骨髓細胞豐富度 (Cellularity)：正常值為 100 - 年齡 ± 10% (40歲約 50-70%)；再生不良性貧血 (AA) 嚴重發育低下 (<20%)。",
        "粒紅比值 (M:E ratio)：正常值 2:1 ~ 4:1 (平均 3:1)；計算時不計淋巴球、單核球與巨核細胞。",
        "普魯士藍鐵染色：評估巨噬細胞含鐵血黃素與鐵母細胞；環狀鐵母細胞 (Ring sideroblasts) 為鐵顆粒圍繞細胞核 ≧ 1/3 圓周 (粒線體鐵堆積，見於 MDS-RS)。",
        "乾抽 (Dry Tap) 鑑別：原發性骨髓纖維化 (PMF 伴淚滴紅血球)、毛細胞白血病 (HCL TRAP陽性)、腫瘤骨轉移。"
      ],
      actions: "懷疑急性白血病骨髓穿刺檢體，應同步留取肝素管送流式細胞免疫分型與 EDTA 管送細胞遺傳/分子融合基因 (PML-RARA, BCR-ABL) 檢驗。"
    },
    {
      id: "HEM-SOP-002",
      title: "不規則抗體篩檢、鑑定盤 (Panel Sheet) 劃除法與交叉試驗作業程序",
      dept: "臨床檢驗醫學中心 輸血醫學科 / 血庫室",
      purpose: "規範血庫抗篩陽性檢體之非預期性抗體鑑定、消除法判讀與主次配血作業。",
      principles: [
        "DAT vs IAT：DAT 測體內已致敏於 RBC 表面之抗體 (AIHA, HDFN)；IAT 測體外血清游離抗體 (抗篩、交叉試驗)。",
        "劃除法 (Rule-out) 鐵則：必須在所有反應相皆為 0 的陰性細胞格劃除；劃除具劑量效應抗體 (Rh, Kidd, Duffy, MNS) 必須使用「同型合子 (Homozygous)」細胞。",
        "自身對照 (Autocontrol)：陰性代表同種抗體 (Alloantibody)；陽性代表自身抗體 (Autoantibody) 或近期延遲性輸血反應。",
        "酵素處理反應：Papain/Ficin 會破壞 M, N, S, s, Fya, Fyb 抗原；增強 Rh (D, C, c, E, e), Kidd (Jka, Jkb), Lewis, P1 抗原反應。"
      ],
      actions: "Kidd 抗體效價衰退極快且為延遲性溶血反應 (DHTR) 最常見元兇；若病人既往史曾檢出 anti-Jka，即使當次抗篩陰性，亦嚴禁輸注含 Jka 抗原之血品！"
    },
    {
      id: "HEM-SOP-003",
      title: "急性輸血不良反應 (AHTR/TRALI/TACO) 鑑別與通報指引",
      dept: "臨床檢驗醫學中心 輸血委員會 / 血庫室",
      purpose: "規範急性溶血反應、輸血相關急性肺損傷 (TRALI) 與循環超載 (TACO) 之實驗室鑑別與緊急處置。",
      principles: [
        "急性溶血性輸血反應 (AHTR)：ABO 不合引發血管內溶血；寒顫、發燒、腰痛、血紅素尿、休克、DIC；立即停輸，重新抽血覆核血型、DAT 及血漿游離血紅素。",
        "輸血相關急性肺損傷 (TRALI)：供血者抗-HLA/HNA 抗體活化受血者肺中性球導致非心因性肺水腫；輸血 6 小時內呼吸困難、雙側肺浸潤，無心衰竭特徵。",
        "循環超載 (TACO)：輸注過快導致心因性肺水腫；BNP/NT-proBNP 顯著上升，利尿劑治療有效。",
        "過敏性休克 (Anaphylaxis)：受血者先天 IgA 缺乏伴 anti-IgA 抗體；無發熱，迅速出現喉頭水腫休克，給予 Epinephrine。"
      ],
      actions: "發生疑似輸血反應時，立即停止輸血並保持靜脈輸液通路，血袋連同輸血套管及新鮮抗凝檢體立即送交血庫啟動緊急調查流程。"
    }
  ],

  microscopy_sops: [
    {
      id: "MIC-SOP-001",
      title: "尿沉渣顯微鏡檢標本製備與管型/結晶標準判讀指引",
      dept: "臨床檢驗醫學中心 臨床檢驗科 / 尿液鏡檢室",
      purpose: "規範 CLSI GP16 尿沉渣離心濃縮倍數、病理性管型 (Casts) 與異常結晶鑑別標準。",
      principles: [
        "標本製備：取 10-12 mL 新鮮晨尿，以 400 g (約 1500-2000 rpm) 離心 5 分鐘，吸除上清液保留 0.5-1.0 mL 沉渣混勻鏡檢。",
        "管型 (Casts) 基質：由亨利氏環升支及遠曲小管分泌之 Tamm-Horsfall 黏蛋白 (Uromodulin) 凝膠化形成；高酸度、高滲透壓、尿流滯留促其沉澱。",
        "管型病理對應：紅血球管型 (急性腎絲球腎炎金標準)、白血球管型 (急性腎盂腎炎)、顆粒管型 (實質腎病變)、蠟狀管型 (折光強邊緣缺刻，慢性腎衰竭)、脂肪管型/卵圓脂肪體 (Maltese cross，腎病症候群)。",
        "異常病理結晶 (只出現在酸性尿)：胱胺酸 (六角形板狀，Cystinuria)、酪胺酸 (細針束)、白胺酸 (同心圓輪紋油滴球)、膽固醇 (缺角板狀)。"
      ],
      actions: "鏡檢發現紅血球管型、蠟狀管型或胱胺酸結晶時，應由資深醫檢師雙人覆核，並於檢驗資訊系統 (LIS) 加註鏡檢影像存檔備查。"
    },
    {
      id: "MIC-SOP-002",
      title: "腦脊髓液 (CSF) 採檢外傷性穿刺 vs 蜘蛛網膜下腔出血 (SAH) 鑑別程序",
      dept: "臨床檢驗醫學中心 急診檢驗室 / 體液鏡檢組",
      purpose: "規範 CSF 腰椎穿刺管收集順序、外觀黃變 (Xanthochromia) 測定與各型腦膜炎鑑別。",
      principles: [
        "四管穿刺順序：第1管生化免疫、第2管微生物、第3管血球計數顯微鏡檢、第4管細胞病理/特殊分析。",
        "外傷穿刺 vs SAH：外傷穿刺三管血色漸淡、離心上清液澄清無色、易形成纖維凝塊；SAH 各管均勻血紅、離心上清液黃變 (Xanthochromia 415/450 nm 吸收峰)、不凝固、見含鐵血黃素巨噬細胞。",
        "腦膜炎鑑別：細菌性 (PMN為主、蛋白飆高、糖極低 CSF/血糖比 <0.4)；病毒性 (淋巴球為主、糖完全正常)；結核性 (淋巴/單核球、糖極低、ADA 顯著升高)；隱球菌 (印度墨負染色莢膜透明暈圈)。"
      ],
      actions: "CSF 為不可重複採集之極度珍貴檢體，微生物培養與鏡檢報告列為第一優先危急值，檢出細菌、隱球菌或異常母細胞 30 分鐘內立即通報。"
    },
    {
      id: "MIC-SOP-003",
      title: "臨床分子檢驗實驗室分區防污染與 UNG 酵素防護作業規範",
      dept: "臨床檢驗醫學中心 分子病理檢驗科",
      purpose: "規範 PCR 實驗室單向動線物理隔離、氣壓梯級設計與 dUTP/UNG 擴增產物防污染機制。",
      principles: [
        "四區單向動線：試劑配製區 (正壓，嚴禁模板) -> 檢體抽取區 (負壓，生物安全櫃) -> 擴增區 (負壓) -> 產物分析區 (最強負壓，電泳/定序)；人員檢體嚴禁逆行。",
        "dUTP + UNG 防污系統：所有 PCR 配方以 dUTP 取代 dTTP；循環前 50°C 作用使 UNG 專一性水解前次含 U 污染產物，95°C 高溫裂解產物並使 UNG 永久失活。",
        "qPCR 染劑與探針：SYBR Green I (結合雙股小凹槽，需做熔解曲線分析確認單一峰值排除二聚體)；TaqMan 水解探針 (5'->3' 外切酶水解螢光，專一性極高)。",
        "重大腫瘤標靶：EGFR (外顯子 19 缺失與 L858R 敏感突變；T790M 耐藥突變)；KRAS (密碼子 12/13 突變陽性禁止使用抗 EGFR 單株抗體)。"
      ],
      actions: "每次 PCR 批次檢驗必須同時帶入無模板陰性對照 (NTC)、陽性對照及內對照 (IC)；若 NTC 出現擴增訊號，整批次檢驗作廢並執行環境去核酸消毒。"
    }
  ],

  serology_sops: [
    {
      id: "SER-SOP-001",
      title: "ICAP 抗核抗體 (ANA) HEp-2 螢光圖譜判讀標準作業程序",
      dept: "臨床檢驗醫學中心 過敏免疫風濕科檢驗室",
      purpose: "規範間接免疫螢光法 (IFA) 檢測 HEp-2 細胞核抗體之國際共識 (ICAP) 分類與疾病關聯。",
      principles: [
        "間接免疫螢光受質：HEp-2 人類喉癌細胞 (抗原多、核大、具間期與分裂期細胞)。",
        "AC-1 均勻型 (Homogeneous)：間期核均勻著色，分裂期染色體強陽性；對應抗-dsDNA (SLE 專一且與活動度平行)、抗-Histone (藥物性狼瘡 >95%)。",
        "AC-4, AC-5 斑點型 (Speckled)：間期核呈顆粒斑點，分裂期染色體不著色；對應抗-Sm (SLE 專一)、抗-U1-RNP (MCTD)、抗-SS-A/SS-B (乾燥症)。",
        "AC-3 著絲點型 (Centromere)：間期核 40-60 個整齊點狀，分裂期排成一字條帶；對應 CENP-A/B，為 CREST 症候群 / 局限型硬皮症特異標記。",
        "AC-8~10 核仁型 (Nucleolar)：僅間期細胞核仁著色；對應抗-Scl-70 (拓撲異構酶 I)，為瀰漫型硬皮症 (Diffuse SSc) 特異標記。"
      ],
      actions: "ANA 篩檢以 1:160 為臨床顯著陽性截斷值；初次檢出強陽性者，系統建議加驗抗-ENA (Sm, RNP, Ro, La, Scl-70) 及抗-dsDNA 進行精準分型。"
    },
    {
      id: "SER-SOP-002",
      title: "B 型肝炎 (HBV) 與 C 型肝炎 (HCV) 血清標記消長與分子檢驗矩陣",
      dept: "臨床檢驗醫學中心 病毒肝炎檢驗室",
      purpose: "規範肝炎抗原抗體組合判讀、空窗期判定與 HCV RNA 分子定性定量檢驗標準。",
      principles: [
        "HBV 標記核心意義：HBsAg (感染指標)、Anti-HBs (保護性抗體)、HBeAg (活躍複製高傳染力)、Anti-HBe (血清轉換複製減弱)、Anti-HBc IgM (急性感染黃金標記)、Anti-HBc IgG (曾感染標記)。",
        "★空窗期 (Window Period)：HBsAg 下降消失而 Anti-HBs 尚未上升之空檔，唯一可檢出之標記為 Anti-HBc IgM！",
        "自然感染痊癒 vs 疫苗接種：自然痊癒者 Anti-HBs 與 Anti-HBc IgG 皆陽性；疫苗接種成功者僅 Anti-HBs 單獨陽性，Anti-HBc 絕對為陰性。",
        "HCV 檢驗：Anti-HCV 陽性不能區分現行感染或已治癒，必須檢驗 HCV RNA (RT-qPCR) 確診；抗病毒藥 DAA 治癒評估指標為 SVR12 (停藥12週病毒陰性)。"
      ],
      actions: "孕婦產前篩檢檢出 HBsAg(+) 伴 HBeAg(+) 時，通報產房於新生兒出生 24 小時內注射 B 肝免疫球蛋白 (HBIG) 及公費 B 肝疫苗以防母嬰垂直感染。"
    },
    {
      id: "SER-SOP-003",
      title: "HIV 第四代抗原/抗體複合篩檢 (Ag/Ab Combo) 與分子確診指引",
      dept: "臨床檢驗醫學中心 感染科檢驗室 / 病毒室",
      purpose: "規範第四代 EIA/CLIA 篩檢法、抗體鑑別與 HIV RNA 病毒載量檢驗流程。",
      principles: [
        "第四代 Ag/Ab Combo：同時測定 HIV-1/2 抗體與游離 p24 核心衣殼抗原；將檢驗空窗期由 4-6 週縮短至 14 天左右。",
        "確診流程：第四代初篩陽性 -> 進行 HIV-1/HIV-2 抗體鑑別免疫墨跡 (Geenius) -> 若抗體不確定或陰性，立即檢驗 HIV-1 RNA 病毒載量 (RT-qPCR) 確診早期急性感染。",
        "構造蛋白：gp120 (結合 CD4 及 CCR5/CXCR4 輔助受體)、gp41 (跨膜融合)、p24 (核心衣殼)。",
        "愛滋病 (AIDS) 定義：外周血 CD4+ T 淋巴球 < 200/μL，或合併卡氏肺囊蟲肺炎 (PCP)、隱球菌腦膜炎等伺機性感染。"
      ],
      actions: "初次 HIV 確診案件列為重大法定傳染病，24 小時內依法令進行疾病管制署傳染病通報，並由專任個案管理師啟動就醫諮詢與隱私保護。"
    }
  ]
};

