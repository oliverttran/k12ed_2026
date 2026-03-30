const DATA = [
  {
    /****************************************************************
     * ACM PAPERS (26 Total)
    *****************************************************************/
    paper_id:"MargolisEtAl_2012", year:2012, title:"Beyond Access: Broadening Participation in High School Computer Science",
    authors:"Margolis et al.", country:"USA", state:"CA",
    grades:[9, 10], population_focus:"Latinx; Black; Low-Income",
    study_type:"Case Study", n_students:2000, n_teachers:null, n_sites:27,
    course_or_context:"Classroom", tools:"Scratch", language:"Scratch",
    outcome_type:"Access", result_direction:"positive",
    key_findings:"District reform (ECS) expanded from pilot to 27 HS with meaningful uptake among Latino/a and Black students.",
    limitations_short:"Qual evidence from selected sites; limited validated CS assessments; context-specific to large urban district.",
    url_or_doi:"https://dl.acm.org/doi/10.1145/2381083.2381102",
    tags:"", library:"ACM"
  },
  {
    paper_id:"MagerkoEtAl_2015", year:2015, title:"EarSketch: a STEAM approach to broadening participation in AP CSP",
    authors:"Magerko et al.", country:"USA", state:"GA",
    grades:[9, 10, 11, 12], population_focus:"Unspecified",
    study_type:"Case Study", n_students:null, n_teachers:null, n_sites:4,
    course_or_context:"AP", tools:"EarSketch", language:"Python; JavaScript",
    outcome_type:"Learning", result_direction:"mixed/nuanced",
    key_findings:"Feasibility across typical HS; teachers can run EarSketch; equity rationale via music-making.",
    limitations_short:"Small N of teachers/classes; short duration; no randomized comparison.",
    url_or_doi:"https://dl.acm.org/doi/10.1145/2886418",
    tags:"", library:"ACM"
  },

  {
    paper_id:"SaxEtAl_2020", year:2020, title:"Does AP CS Principles Broaden Participation in Computing? An Analysis of APCSA and APCSP Participants",
    authors:"Sax et al.", country:"USA", state:"National",
    grades:[9, 10, 11, 12], population_focus:"Unspecified",
    study_type:"Survey", n_students:8844, n_teachers:null, n_sites:null,
    course_or_context:"AP", tools:"", language:"",
    outcome_type:"Access", result_direction:"",
    key_findings:"",
    limitations_short:"",
    url_or_doi:"https://dl.acm.org/doi/10.1145/3328778.3366826",
    tags:"", library:"ACM"
  },

  {
    paper_id:"AdamsWebster_2012", year:2012, title:"What Do Students Learn About Programming From Game, Music Video, and Storytelling Projects?",
    authors:"Adams and Webster", country:"USA", state:"MI",
    grades:[6, 7, 8], population_focus:"Women",
    study_type:"Case Study", n_students:322, n_teachers:null, n_sites:null,
    course_or_context:"Summer Program", tools:"Alice; Scratch", language:"Alice; Scratch",
    outcome_type:"Learning", result_direction:"",
    key_findings:"",
    limitations_short:"",
    url_or_doi:"https://dl.acm.org/doi/10.1145/2157136.2157319",
    tags:"", library:"ACM"
  },

  {
    paper_id:"FranklinEtAl_2013", year:2013, title:"Assessment of Computer Science Learning in a Scratch-Based Outreach Program.",
    authors:"Franklin et al.", country:"USA", state:"CA",
    grades:[6, 7, 8], population_focus:"Unspecified",
    study_type:"Case Study", n_students:22, n_teachers:null, n_sites:null,
    course_or_context:"Summer Program", tools:"Scratch", language:"Scratch",
    outcome_type:"Learning", result_direction:"",
    key_findings:"",
    limitations_short:"",
    url_or_doi:"https://dl.acm.org/doi/10.1145/2445196.2445304",
    tags:"Culturally Relevant", library:"ACM"
  },

  {
    paper_id:"EglashEtAl_2011", year:2011, title:"Fractal Simulations of African Design in Pre-College Computing Education",
    authors:"Eglash et al.", country:"USA", state:"NY",
    grades:[10], population_focus:"Black; Latinx",
    study_type:"Case Study", n_students:40, n_teachers:null, n_sites:null,
    course_or_context:"Classroom", tools:"", language:"Java",
    outcome_type:"Engagement", result_direction:"",
    key_findings:"",
    limitations_short:"",
    url_or_doi:"https://dl.acm.org/doi/10.1145/2037276.2037281",
    tags:"", library:"ACM"
  },

  {
    paper_id:"GroverBasuSchank_2018", year:2018, title:"What We Can Learn About Student Learning From Open-Ended Programming Projects in Middle School Computer Science.",
    authors:"Grover et al.", country:"USA", state:"",
    grades:[6, 7, 8], population_focus:"Unspecified",
    study_type:"Case Study", n_students:79, n_teachers:null, n_sites:null,
    course_or_context:"Classroom", tools:"Scratch", language:"Scratch",
    outcome_type:"Learning", result_direction:"",
    key_findings:"",
    limitations_short:"",
    url_or_doi:"https://dl.acm.org/doi/10.1145/3159450.3159522",
    tags:"CS For All", library:"ACM"
  },

  {
    paper_id:"GoldsmithStanton_2021", year:2021, title:"Equity for Massachusetts Students’ CS Education: How Well Has the State Been Doing?",
    authors:"Goldsmith and Stanton", country:"USA", state:"MA",
    grades:[9, 10, 11, 12], population_focus:"Unspecified",
    study_type:"Review", n_students:null, n_teachers:null, n_sites:null,
    course_or_context:"AP", tools:"", language:"",
    outcome_type:"Access", result_direction:"",
    key_findings:"",
    limitations_short:"",
    url_or_doi:"https://dl.acm.org/doi/10.1145/3408877.3432447",
    tags:"", library:"ACM"
  },

  {
    paper_id:"LeeEtAl_2021", year:2021, title:"Developing Middle School Students’ AI Literacy.",
    authors:"Lee et al.", country:"USA", state:"MA",
    grades:[6, 7, 8], population_focus:"Unspecified",
    study_type:"Case Study", n_students:31, n_teachers:null, n_sites:null,
    course_or_context:"Summer Program", tools:"Google Teachable Machine; Scratch", language:"Scratch",
    outcome_type:"Learning", result_direction:"",
    key_findings:"",
    limitations_short:"",
    url_or_doi:"https://dl.acm.org/doi/10.1145/3408877.3432513",
    tags:"", library:"ACM"
  },

  {
    paper_id:"WangEtAl_2015", year:2015, title:"Gender Differences in Factors Influencing Pursuit of Computer Science and Related Fields.",
    authors:"Wang et al.", country:"USA", state:"National",
    grades:[9, 10, 11, 12], population_focus:"Women",
    study_type:"Survey", n_students:1739, n_teachers:null, n_sites:null,
    course_or_context:"", tools:"", language:"",
    outcome_type:"Access", result_direction:"",
    key_findings:"",
    limitations_short:"",
    url_or_doi:"https://dl.acm.org/doi/10.1145/2729094.2742611",
    tags:"", library:"ACM"
  },

  {
    paper_id:"SnowEtAl_2017", year:2017, title:"Principled Assessment of Student Learning in High School Computer Science.",
    authors:"Snow et al.", country:"USA", state:"CA; IL; NY",
    grades:[9, 10], population_focus:"Women",
    study_type:"Case Study", n_students:941, n_teachers:null, n_sites:null,
    course_or_context:"Classroom", tools:"", language:"",
    outcome_type:"Learning", result_direction:"",
    key_findings:"",
    limitations_short:"",
    url_or_doi:"https://dl.acm.org/doi/10.1145/3105726.3106186",
    tags:"", library:"ACM"
  },

  {
    paper_id:"Basu_2019", year:2019, title:"Using Rubrics Integrating Design and Coding to Assess Middle School Students’ Open-ended Block-based Programming Projects.",
    authors:"Basu", country:"USA", state:"CA",
    grades:[6, 7, 8], population_focus:"Low-Income; Unspecified",
    study_type:"Case Study", n_students:160, n_teachers:null, n_sites:null,
    course_or_context:"Classroom", tools:"Scratch; MIT App Inventor", language:"Scratch",
    outcome_type:"Learning", result_direction:"",
    key_findings:"",
    limitations_short:"",
    url_or_doi:"https://dl.acm.org/doi/10.1145/3287324.3287412",
    tags:"CS For All", library:"ACM"
  },
  {
    paper_id:"Judd_2020", year:2020, title:"Activities for Building Understanding: How AI4ALL Teaches AI",
    authors:"Judd", country:"USA", state:"",
    grades:[9, 10, 11, 12], population_focus:"Unspecified",
    study_type:"Case Study", n_students:null, n_teachers:null, n_sites:null,
    course_or_context:"Classroom", tools:"", language:"",
    outcome_type:"Learning", result_direction:"descriptive/no outcomes",
    key_findings:"Hands-on activities to define AI and compare human vs machine learning.",
    limitations_short:"No empirical evaluation; effectiveness depends on local context.",
    url_or_doi:"https://dl.acm.org/doi/10.1145/3328778.3366990",
    tags:"CS For All", library:"ACM"
  },
  {
    paper_id:"BanilowerCraven_2020", year:2020, title:"Factors Associated With High-Quality CS Instruction: Data from a Nationally Representative Sample of High School Teachers",
    authors:"Banilower and Craven", country:"USA", state:"National",
    grades:[9, 10, 11, 12], population_focus:"Unspecified; Rural",
    study_type:"Survey", n_students:null, n_teachers:300, n_sites:null,
    course_or_context:"", tools:"", language:"",
    outcome_type:"Learning", result_direction:"descriptive/associational",
    key_findings:"More PD (≥35 hrs), preparedness, and coherent materials predict more frequent CS practices.",
    limitations_short:"Self-report survey; correlational—not causal; no classroom observation.",
    url_or_doi:"https://dl.acm.org/doi/10.1145/3328778.3366831",
    tags:"", library:"ACM"
  },
  {
    paper_id:"RutsteinEtAl_2019", year:2019, title:"Developing Implementation Measures for K–12 CS Curriculum",
    authors:"Rutstein et al.", country:"USA", state:"CA",
    grades:[9, 10, 11, 12], population_focus:"Unspecified",
    study_type:"Survey", n_students:null, n_teachers:53, n_sites:null,
    course_or_context:"Teacher Development", tools:"", language:"",
    outcome_type:"Learning", result_direction:"mixed/nuanced",
    key_findings:"Higher inquiry/collaboration indices link to better unit outcomes; tech access constraints shape lesson choices.",
    limitations_short:"Self-report; unit-specific effects; modest sample size.",
    url_or_doi:"https://dl.acm.org/doi/10.1145/3287324.3287424",
    tags:"", library:"ACM"
  },
  {
    paper_id:"Adams_2010", year:2010, title:"Scratching Middle Schoolers’ Creative Itch",
    authors:"Adams", country:"USA", state:"MI",
    grades:[6, 7, 8], population_focus:"Unspecified; Disability",
    study_type:"Case Study", n_students:null, n_teachers:null, n_sites:2,
    course_or_context:"Summer Program", tools:"Scratch; Alice", language:"Scratch; Alice",
    outcome_type:"Engagement", result_direction:"Unspecified/nuanced",
    key_findings:"Scratch lowered entry compared to Alice; stories/game projects showed positive engagement; accessibility via Scratch allowed deep involvement for some blind students.",
    limitations_short:"Prior experience confound; IDE limitations; no comparison/control; assessment mostly descriptive.",
    url_or_doi:"https://dl.acm.org/doi/10.1145/1734263.1734385",
    tags:"", library:"ACM"
  },
  {
    paper_id:"WeintropWilensky_2017", year:2017, title:"Comparing Block-Based and Text-Based Programming in High School Computer Science Classrooms",
    authors:"Weintrop & Wilensky", country:"USA", state:"IL",
    grades:[9, 10, 11, 12], population_focus:"Unspecified",
    study_type:"Case Study", n_students:60, n_teachers:1, n_sites:1,
    course_or_context:"Classroom", tools:"Scratch; Pencil", language:"Scratch",
    outcome_type:"Learning", result_direction:"mixed/nuanced",
    key_findings:"Similar scores overall; text-based group scored higher on comprehension; block-based group reported greater desire to take more CS.",
    limitations_short:"Short 5-week window; single selective public school; constrained to Pencil.cc; teacher choice of methods may vary.",
    url_or_doi:"https://dl.acm.org/doi/10.1145/3089799",
    tags:"", library:"ACM"
  },
  {
    paper_id:"KafaiEtAl_2014", year:2014, title:"A Crafts-Oriented Approach to Computing in High School: Introducing Computational Concepts, Practices, and Perspectives with Electronic Textiles",
    authors:"Kafai et al.", country:"USA", state:"",
    grades:[11, 12], population_focus:"Unspecified",
    study_type:"Case Study", n_students:15, n_teachers:1, n_sites:1,
    course_or_context:"Classroom", tools:"Arduino", language:"",
    outcome_type:"Engagement", result_direction:"positive/mixed",
    key_findings:"Students produced personally relevant crafts; reported shifting perceptions of CS as creative and connected to lives; evidence of CT practices (circuits, debugging, design).",
    limitations_short:"Short course; emphasis on crafts may reduce time on formal concepts; some results context-specific.",
    url_or_doi:"https://dl.acm.org/doi/10.1145/2576874",
    tags:"", library:"ACM"
  },
  {
    paper_id:"Ryoo_2019", year:2019, title:"Pedagogy that Supports Computer Science for All",
    authors:"Ryoo", country:"USA", state:"CA",
    grades:[9, 10, 11, 12], population_focus:"Unspecified",
    study_type:"Case Study", n_students:70, n_teachers:3, n_sites:3,
    course_or_context:"Classroom", tools:"Circuits; E-textiles", language:"",
    outcome_type:"Engagement", result_direction:"positive",
    key_findings:"Justice-centered, culturally relevant pedagogy demystified CS, connected to everyday life, and amplified student voice → engagement and agency.",
    limitations_short:"Practices may be hard to replicate without teacher PD; some misalignment with all five CRP tenets noted.",
    url_or_doi:"https://dl.acm.org/doi/10.1145/3322210",
    tags:"CS For All", library:"ACM"
  },
  {
    paper_id:"WangandMoghadam_2017", year:2017, title:"Diversity Barriers in K-12 Computer Science Education: Structural and Social",
    authors:"Wang & Moghadam", country:"USA", state:"CA",
    grades:[], population_focus:"Black; Latinx; Women",
    study_type:"Survey", n_students:1672, n_teachers:1008, n_sites:null,
    course_or_context:"", tools:"", language:"",
    outcome_type:"Access", result_direction:"descriptive",
    key_findings:"Interest higher for boys; access often via after-school CS; encouragement from teachers/parents linked to interest; awareness gaps for girls.",
    limitations_short:"Survey design varies across years; observational—no causality.",
    url_or_doi:"https://dl.acm.org/doi/10.1145/3017680.3017734",
    tags:"CS For All", library:"ACM"
  },

  {
    paper_id:"VogalEtAl_2017", year:2017, title:"Visions of Computer Science Education: Unpacking Arguments for and Projected Impacts of CS4All Initiatives",
    authors:"Vogal et al.", country:"USA", state:"NY",
    grades:[], population_focus:"Unspecified",
    study_type:"Survey", n_students:null, n_teachers:24, n_sites:null,
    course_or_context:"Teacher Development", tools:"", language:"",
    outcome_type:"Access", result_direction:"",
    key_findings:"",
    limitations_short:"",
    url_or_doi:"https://dl.acm.org/doi/10.1145/3017680.3017755",
    tags:"CS For All", library:"ACM"
  },

  {
    paper_id:"FreemanEtAl_2014", year:2014, title:"Engaging underrepresented groups in high school introductory computing through computational remixing with EarSketch",
    authors:"Freeman et al.", country:"USA", state:"GA",
    grades:[9], population_focus:"Women; Unspecified",
    study_type:"Case Study", n_students:69, n_teachers:null, n_sites:null,
    course_or_context:"Classroom", tools:"EarSketch", language:"Python",
    outcome_type:"Engagement", result_direction:"",
    key_findings:"",
    limitations_short:"",
    url_or_doi:"https://dl.acm.org/doi/10.1145/2538862.2538906",
    tags:"", library:"ACM"
  },

  {
    paper_id:"WangEtAl_2016", year:2016, title:"Landscape of K-12 Computer Science Education in the U.S.: Perceptions, Access, and Barriers",
    authors:"Wang et al.", country:"USA", state:"National",
    grades:[], population_focus:"Unspecified; Low-Income",
    study_type:"Survey", n_students:1673, n_teachers:1013, n_sites:null,
    course_or_context:"Classroom", tools:"", language:"",
    outcome_type:"Access", result_direction:"",
    key_findings:"",
    limitations_short:"",
    url_or_doi:"https://dl.acm.org/doi/10.1145/2839509.2844628",
    tags:"", library:"ACM"
  },

  {
    paper_id:"EreteEtAl_2024", year:2024, title:"Applying a Transformative Justice Approach to Encourage the Participation of Black and Latina Girls in Computing",
    authors:"Erete et al.", country:"USA", state:"IL",
    grades:[6, 7, 8, 9, 10, 11, 12], population_focus:"Black; Latinx; Women",
    study_type:"Review", n_students:null, n_teachers:null, n_sites:null,
    course_or_context:"Out-of-school Program", tools:"", language:"",
    outcome_type:"Access", result_direction:"descriptive",
    key_findings:"Justice-oriented principles: acknowledge histories of harm; counter stereotypes; build sustainable community capacity.",
    limitations_short:"Not a new empirical study; relies on program field notes and prior evidence.",
    url_or_doi:"https://dl.acm.org/doi/10.1145/3451345",
    tags:"DYD", library:"ACM"
  },
  {
    paper_id:"GretterEtAl_2019", year:2019, title:"Equitable Learning Environments in K-12 Computing: Teachers’ Views on Barriers to Diversity",
    authors:"Gretter et al.", country:"USA", state:"",
    grades:[9, 10, 11, 12], population_focus:"Unspecified; Low-Income",
    study_type:"Survey", n_students:null, n_teachers:23, n_sites:null,
    course_or_context:"Classroom", tools:"", language:"",
    outcome_type:"Access", result_direction:"descriptive",
    key_findings:"Teachers cited gender, ethnicity, SES, demographics, and recruitment practices as key barriers; discussed classroom strategies for inclusion.",
    limitations_short:"Teacher testimony only; no student data; regional generalizability limits.",
    url_or_doi:"https://dl.acm.org/doi/10.1145/3282939",
    tags:"CS For All", library:"ACM"
  },
  {
    paper_id:"VogelEtAl_2019", year:2019, title:"The Role of Translanguaging in Computational Literacies",
    authors:"Vogel et al.", country:"USA", state:"NY",
    grades:[6, 7, 8], population_focus:"Latinx",
    study_type:"Case Study", n_students:null, n_teachers:null, n_sites:null,
    course_or_context:"Classroom", tools:"Scratch", language:"Scratch",
    outcome_type:"Learning", result_direction:"descriptive/positive",
    key_findings:"Students leverage full linguistic resources to engage in CT (e.g., remixing, abstraction); computational literacies intertwine with other literacies.",
    limitations_short:"No quantitative learning outcomes; small convenience samples.",
    url_or_doi:"https://dl.acm.org/doi/10.1145/3287324.3287368",
    tags:"CS For All", library:"ACM"
  },












  /****************************************************************
   * IEEE PAPERS (19 Total)
   *****************************************************************/
  { // Under ACM Sheet
    paper_id:"SantoEtAl_2019", year:2019, title:"Equity in the Who, How and What of Computer Science Education: K12 School District Conceptualizations of Equity in ‘CS for All’ Initiatives",
    authors:"Santo et al.", country:"USA", state:"",
    grades:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], population_focus:"Rural",
    study_type:"Review", n_students:null, n_teachers:null, n_sites:null,
    course_or_context:"Classroom", tools:"", language:"",
    outcome_type:"Access", result_direction:"",
    key_findings:"",
    limitations_short:"",
    url_or_doi:"https://doi.org/10.1109/RESPECT46404.2019.8985901",
    tags:"CS For All", library:"IEEE"
  },



  {
    paper_id:"MadkinsEtAl_2019", year:2019, title:"Culturally Relevant Computer Science Pedagogy: From Theory to Practice",
    authors:"Madkins et al.", country:"USA", state:"CA",
    grades:[9, 10, 11, 12], population_focus:"Women; Unspecified",
    study_type:"Case Study", n_students:1913, n_teachers:15, n_sites:null,
    course_or_context:"Summer Program; Classroom", tools:"Scratch", language:"Scratch",
    outcome_type:"Engagement", result_direction:"",
    key_findings:"",
    limitations_short:"",
    url_or_doi:"",
    tags:"Culturally Relevant", library:"IEEE"
  },
  {
    paper_id:"BuffumEtAl_2015", year:2015, title:"Leveraging collaboration to improve gender equity in a game-based learning environment for middle school computer science",
    authors:"Buffum et al.", country:"USA", state:"NC",
    grades:[6, 7, 8], population_focus:"Women",
    study_type:"Case Study", n_students:76, n_teachers:null, n_sites:null,
    course_or_context:"Classroom", tools:"Engage", language:"",
    outcome_type:"Learning", result_direction:"",
    key_findings:"",
    limitations_short:"",
    url_or_doi:"https://doi.org/10.1109/RESPECT.2015.7296496",
    tags:"", library:"IEEE"
  },
  {
    paper_id:"WashingtonEtAl_2020", year:2020, title:"Understanding How to Engage Black HS Boys in Computer Science Through Tech Innovation and Entrepreneurship",
    authors:"Washington et al.", country:"USA", state:"DC",
    grades:[9, 10, 11, 12], population_focus:"Black",
    study_type:"Case Study", n_students:20, n_teachers:null, n_sites:null,
    course_or_context:"Summer Program", tools:"", language:"Python",
    outcome_type:"Engagement", result_direction:"",
    key_findings:"",
    limitations_short:"",
    url_or_doi:"https://doi.org/10.1109/MCSE.2019.2950408",
    tags:"", library:"IEEE"
  },
  {
    paper_id:"CohoonEtAl_2011", year:2011, title:"Focusing high school teachers on attracting diverse students to computer science and engineering",
    authors:"Cohoon et al.", country:"USA", state:"VA",
    grades:[9, 10, 11, 12], population_focus:"Women",
    study_type:"Case Study", n_students:null, n_teachers:90, n_sites:null,
    course_or_context:"Teacher Development", tools:"", language:"",
    outcome_type:"Access", result_direction:"",
    key_findings:"",
    limitations_short:"",
    url_or_doi:"https://doi.org/10.1109/FIE.2011.6143054",
    tags:"", library:"IEEE"
  },
  {
    paper_id:"EreteEtAl_2016", year:2016, title:"Exploring the use of interactive narratives to engage inner-city girls in computational activities",
    authors:"Erete et al.", country:"USA", state:"IL",
    grades:[6, 7, 8], population_focus:"Women",
    study_type:"Case Study", n_students:16, n_teachers:null, n_sites:null,
    course_or_context:"Out-of-school Program", tools:"Arduino; E-textiles", language:"",
    outcome_type:"Access", result_direction:"",
    key_findings:"",
    limitations_short:"",
    url_or_doi:"https://doi.org/10.1109/RESPECT.2016.7836168",
    tags:"DYD", library:"IEEE"
  },
  {
    paper_id:"NesibaEtAl_2015", year:2015, title:"Young Women in Computing: Creating a successful and sustainable pipeline",
    authors:"Nessiba et al.", country:"USA", state:"NM",
    grades:[6, 7, 8, 9, 10, 11, 12], population_focus:"Women",
    study_type:"Survey", n_students:366, n_teachers:null, n_sites:null,
    course_or_context:"Summer Program", tools:"Arduino; MIT App Inventor", language:"",
    outcome_type:"Access", result_direction:"",
    key_findings:"",
    limitations_short:"",
    url_or_doi:"",
    tags:"", library:"IEEE"
  },
  {
    paper_id:"WangEtAl_2019", year:2019, title:"A Coding/Programming Academy for 6th-Grade Females to Increase Knowledge and Interest in Computer Science",
    authors:"Wang et al.", country:"USA", state:"TX",
    grades:[6], population_focus:"Women",
    study_type:"Case Study", n_students:50, n_teachers:null, n_sites:null,
    course_or_context:"Summer Program", tools:"Lego", language:"",
    outcome_type:"Engagement", result_direction:"",
    key_findings:"",
    limitations_short:"",
    url_or_doi:"https://doi.org/10.1109/FIE43999.2019.9028578",
    tags:"", library:"IEEE"
  },
  {
    paper_id:"AguarEtAl_2016", year:2016, title:"Making CS Inclusive: An Overview of Efforts to Expand and Diversify CS Education",
    authors:"Aguar et al.", country:"USA", state:"",
    grades:[], population_focus:"Women",
    study_type:"Review", n_students:null, n_teachers:null, n_sites:null,
    course_or_context:"", tools:"", language:"",
    outcome_type:"Access", result_direction:"",
    key_findings:"",
    limitations_short:"",
    url_or_doi:"https://doi.org/10.1109/CSCI.2016.0067",
    tags:"", library:"IEEE"
  },
  {
    paper_id:"Braswell_2020", year:2020, title:"From Camp to Conferences: Experiences in Leveraging Tech Conferences to Inspire Black and Latinx Girls to Pursue Coding and Tech Careers",
    authors:"Braswell", country:"USA", state:"NC",
    grades:[6, 7, 8, 9, 10, 11, 12], population_focus:"Black; Latinx; Women",
    study_type:"Case Study", n_students:5, n_teachers:null, n_sites:null,
    course_or_context:"Summer Program", tools:"", language:"HTML/CSS",
    outcome_type:"Learning", result_direction:"",
    key_findings:"",
    limitations_short:"",
    url_or_doi:"https://doi.org/10.1109/RESPECT49803.2020.9272429",
    tags:"", library:"IEEE"
  },
  {
    paper_id:"KhalafallaEtAl_2025", year:2025, title:"Empowering Underrepresented High School Students in STEM Through Hands-On Engineering Technology Summer Camps",
    authors:"Khalafalla et al.", country:"USA", state:"FL",
    grades:[9, 10, 11, 12], population_focus:"Unspecified",
    study_type:"Case Study", n_students:31, n_teachers:null, n_sites:null,
    course_or_context:"Summer Program", tools:"", language:"Python",
    outcome_type:"Access", result_direction:"",
    key_findings:"",
    limitations_short:"",
    url_or_doi:"https://ieeexplore.ieee.org/document/11105022",
    tags:"", library:"IEEE"
  },
  {
    paper_id:"Wang_2024", year:2024, title:"Latinas' Perceptions of Features of an OST STEM Program that Create a Supportive STEM Learning Context: A Qualitative Case Study",
    authors:"Wang", country:"USA", state:"",
    grades:[6, 7, 8, 9, 10, 11, 12], population_focus:"Latinx; Women",
    study_type:"Case Study", n_students:41, n_teachers:null, n_sites:null,
    course_or_context:"Summer Program", tools:"Unity", language:"",
    outcome_type:"Engagement", result_direction:"",
    key_findings:"",
    limitations_short:"",
    url_or_doi:"https://doi.org/10.1109/FIE61694.2024.10893421",
    tags:"", library:"IEEE"
  },
  {
    paper_id:"MackEtAl_2024", year:2024, title:"CodeBears: Key Insights Gained from a Summer Coding Camp Empowering Underrepresented Youth",
    authors:"Mack et al.", country:"USA", state:"",
    grades:[5, 6, 7, 8], population_focus:"Black",
    study_type:"Case Study", n_students:40, n_teachers:null, n_sites:null,
    course_or_context:"Summer Program", tools:"Lego; Scratch; Sphero", language:"Scratch",
    outcome_type:"Access", result_direction:"",
    key_findings:"",
    limitations_short:"",
    url_or_doi:"https://doi.org/10.1109/BICE60192.2024.00021",
    tags:"", library:"IEEE"
  },
  {
    paper_id:"WalkerEtAl_2023", year:2023, title:"Coding Like a Data Miner: A Sandbox Approach to Computing-Based Data Science for High School Student Learning",
    authors:"Walker et al.", country:"USA", state:"TX",
    grades:[9, 10, 11, 12], population_focus:"Unspecified",
    study_type:"Case Study", n_students:14, n_teachers:null, n_sites:null,
    course_or_context:"Classroom", tools:"", language:"",
    outcome_type:"Learning", result_direction:"",
    key_findings:"",
    limitations_short:"",
    url_or_doi:"https://doi.org/10.1109/FIE58773.2023.10343283",
    tags:"CS For All;", library:"IEEE"
  },
  {
    paper_id:"WilleEtAl_2016", year:2016, title:"Computer Science Principles (CSP) and students with learning differences: Expanding opportunities for a hidden underrepresented group",
    authors:"Wille et al.", country:"USA", state:"IL",
    grades:[9, 10, 11, 12], population_focus:"Unspecified; Disability",
    study_type:"Case Study", n_students:87, n_teachers:null, n_sites:null,
    course_or_context:"", tools:"", language:"",
    outcome_type:"Access", result_direction:"",
    key_findings:"",
    limitations_short:"",
    url_or_doi:"https://doi.org/10.1109/RESPECT.2016.7836160",
    tags:"CS For All", library:"IEEE"
  },
  {
    paper_id:"Raigoza_2018", year:2018, title:"An Experience Report on Running a Pre-College Computer Science Summer Program",
    authors:"Raigoza", country:"USA", state:"CA",
    grades:[9, 10, 11, 12], population_focus:"Unspecified",
    study_type:"Case Study", n_students:21, n_teachers:null, n_sites:null,
    course_or_context:"Summer Program", tools:"", language:"Python; JavaScript",
    outcome_type:"Learning", result_direction:"",
    key_findings:"",
    limitations_short:"",
    url_or_doi:"https://doi.org/10.1109/CSCI46756.2018.00131",
    tags:"", library:"IEEE"
  },
  {
    paper_id:"Kamberi_2017", year:2017, title:"Enticing Women to Computer Science with Es (Expose, Engage, Encourage, Empower)",
    authors:"Kamberi", country:"USA", state:"",
    grades:[], population_focus:"Women",
    study_type:"Review", n_students:null, n_teachers:null, n_sites:null,
    course_or_context:"", tools:"", language:"",
    outcome_type:"Access", result_direction:"",
    key_findings:"",
    limitations_short:"",
    url_or_doi:"https://doi.org/10.1109/WIE.2017.8285609",
    tags:"", library:"IEEE"
  },
  {
    paper_id:"BroneakRosato_2021", year:2021, title:"Experiences of Rural CS Principles Educators",
    authors:"Broneak & Rosato", country:"USA", state:"MN",
    grades:[9, 10, 11, 12], population_focus:"Rural",
    study_type:"Case Study", n_students:null, n_teachers:21, n_sites:null,
    course_or_context:"Teacher Development", tools:"", language:"",
    outcome_type:"Engagement", result_direction:"",
    key_findings:"",
    limitations_short:"",
    url_or_doi:"https://doi.org/10.1109/RESPECT51740.2021.9620685",
    tags:"", library:"IEEE"
  },
  {
    paper_id:"YoungEtAl_2017", year:2017, title:"Leveraging a multi-partner approach to develop successful STEM outreach programs",
    authors:"Young et al.", country:"USA", state:"VA",
    grades:[3, 4, 5], population_focus:"Black",
    study_type:"Case Study", n_students:null, n_teachers:null, n_sites:null,
    course_or_context:"Summer Program", tools:"", language:"",
    outcome_type:"Engagement", result_direction:"",
    key_findings:"",
    limitations_short:"",
    url_or_doi:"https://doi.org/10.1109/FIE.2017.8190725",
    tags:"", library:"IEEE"
  },












  /****************************************************************
   * ERIC Papers (12 Total)
   *****************************************************************/
  {
    paper_id:"JacobEtAl_2022", year:2022, title:"Intersectional Development of CS Identities in Young Latinas",
    authors:"Jacob et al.", country:"USA", state:"CA",
    grades:[3, 4, 5], population_focus:"Latinx; Women; Low-Income",
    study_type:"Case Study", n_students:50, n_teachers:7, n_sites:7,
    course_or_context:"Classroom", tools:"Scratch; Code.org", language:"Scratch",
    outcome_type:"Learning", result_direction:"positive",
    key_findings:"Significant gains in CS identity (experience, self-belief, family support); interviews underscore family/peer roles.",
    limitations_short:"Small N; no control; survey adapted from science; possible ceiling effects.",
    url_or_doi:"https://doi.org/10.1177/01614681221103932",
    tags:"", library:"ERIC"
  },
  {
    paper_id:"DeLiraEtAl_2022", year:2022, title:"Summer Programming Camps in a Rural Community",
    authors:"De Lira et al.", country:"USA", state:"WA",
    grades:[6, 7, 8], population_focus:"Rural; Women",
    study_type:"Case Study", n_students:19, n_teachers:null, n_sites:1,
    course_or_context:"Summer Program", tools:"", language:"Python",
    outcome_type:"Learning", result_direction:"positive/mixed",
    key_findings:"Large gains in programming knowledge (d≈0.93); only proficiency self-belief increased.",
    limitations_short:"Small, self-selected sample; short duration; informal setting; no long-term follow-up.",
    url_or_doi:"https://doi.org/10.21585/ijcses.v5i4.145",
    tags:"", library:"ERIC"
  },
  {
    paper_id:"MitchellEtAl_2022", year:2022, title:"Cookie-Jar Alarms_An Analysis of First-grade Students’ Gendered Conceptions of Engineers following a Programming Design Task.",
    authors:"Mitchell et al.", country:"USA", state:"UT",
    grades:[1], population_focus:"Women",
    study_type:"Case Study", n_students:15, n_teachers:null, n_sites:null,
    course_or_context:"Classroom", tools:"KIBO", language:"",
    outcome_type:"Learning", result_direction:"",
    key_findings:"",
    limitations_short:"",
    url_or_doi:"https://doi.org/10.3390/educsci12020110",
    tags:"", library:"ERIC"
  },
  {
    paper_id:"RichEtAl_2019", year:2019, title:"The Landscape of Computing Education in Utah",
    authors:"Rich et al.", country:"USA", state:"UT",
    grades:[], population_focus:"Women; Unspecified",
    study_type:"Review", n_students:null, n_teachers:null, n_sites:null,
    course_or_context:"AP", tools:"", language:"",
    outcome_type:"Access", result_direction:"descriptive",
    key_findings:"Female HS CS enrollment rose to ~34%; seniors with ≥1 CS course ~20% by 2018; AP CSP rollout boosted participation.",
    limitations_short:"~1/3 schools responded; optional items; not causal.",
    url_or_doi:"",
    tags:"", library:"ERIC"
  },
  {
    paper_id:"NorthrupEtAl_2022", year:2022, title:"Identifying Implementation Challenges for a New Rural Computer Science Curriculum in Rural Western Regions of the United States",
    authors:"Northrup et al.", country:"USA", state:"",
    grades:[], population_focus:"Rural",
    study_type:"Survey", n_students:null, n_teachers:13, n_sites:1,
    course_or_context:"Teacher Development", tools:"Scratch", language:"Python; Scratch",
    outcome_type:"Access", result_direction:"",
    key_findings:"",
    limitations_short:"",
    url_or_doi:"",
    tags:"", library:"ERIC"
  },
  {
    paper_id:"KochEtAl_2012", year:2012, title:"Scaling and Sustaining an Afterschool Computer ScienceProgram for Girls",
    authors:"Koch et al.", country:"USA", state:"CA",
    grades:[6, 7, 8], population_focus:"Women",
    study_type:"Case Study", n_students:2000, n_teachers:31, n_sites:33,
    course_or_context:"Afterschool", tools:"", language:"HTML/CSS",
    outcome_type:"Engagement", result_direction:"",
    key_findings:"",
    limitations_short:"",
    url_or_doi:"",
    tags:"", library:"ERIC"
  },
  {
    paper_id:"MasterEtAl_2023", year:2023, title:"Gender equity and motivational readiness for computational thinking in early childhood",
    authors:"Master et al.", country:"USA", state:"RI",
    grades:[1, 2, 3], population_focus:"Women",
    study_type:"Case Study", n_students:363, n_teachers:null, n_sites:null,
    course_or_context:"Out-of-school Program", tools:"Scratch; Kodable", language:"Scratch",
    outcome_type:"Learning", result_direction:"",
    key_findings:"",
    limitations_short:"",
    url_or_doi:"",
    tags:"", library:"ERIC"
  },
  {
    paper_id:"LeonardEtAl_2017", year:2017, title:"Developing Teachers' Computational Thinking Beliefs and Engineering Practices Through Game Design and Robotics",
    authors:"Leonard et al.", country:"USA", state:"WY; PA",
    grades:[3, 4, 5], population_focus:"Rural",
    study_type:"Case Study", n_students:531, n_teachers:30, n_sites:null,
    course_or_context:"Afterschool", tools:"Lego; Scalable Game Design", language:"",
    outcome_type:"Learning", result_direction:"",
    key_findings:"",
    limitations_short:"",
    url_or_doi:"",
    tags:"", library:"ERIC"
  },
  { // No useful information
    paper_id:"BirneyMcNamara_2021", year:2019, title:"The Curriculum and Community Enterprise for Restoration Science:Engaging Marginalized Students in STEM Fields through DataAcquisition and Computational Thinking",
    authors:"Birney and McNamara", country:"USA", state:"NY",
    grades:[], population_focus:"Unspecified",
    study_type:"Review", n_students:null, n_teachers:null, n_sites:null,
    course_or_context:"Classroom", tools:"", language:"",
    outcome_type:"Engagement", result_direction:"",
    key_findings:"",
    limitations_short:"",
    url_or_doi:"https://doi.org/10.5430/jct.v10n4p82",
    tags:"", library:"ERIC"
  },
  {
    paper_id:"FleschEtAl_2021", year:2021, title:"Choreographing Increased Understanding and Positive Attitudestowards Coding By Integrating Dance",
    authors:"Flesch et al.", country:"USA", state:"OR",
    grades:[], population_focus:"Unspecified",
    study_type:"Case Study", n_students:null, n_teachers:null, n_sites:null,
    course_or_context:"Summer Program", tools:"Blockly", language:"",
    outcome_type:"Learning", result_direction:"",
    key_findings:"",
    limitations_short:"",
    url_or_doi:"doi.org/10.21585/ijcses.v4i3.109",
    tags:"", library:"ERIC"
  },
  {
    paper_id:"PlaytonEtAl_2021", year:2021, title:"A Case Study of a Researcher-Practitioner Partnership in Teaching STEM+C to Rural Elementary Students",
    authors:"Playton et al.", country:"USA", state:"TX",
    grades:[4], population_focus:"Rural; Low-Income",
    study_type:"Case Study", n_students:34, n_teachers:null, n_sites:null,
    course_or_context:"Classroom", tools:"", language:"",
    outcome_type:"Learning", result_direction:"",
    key_findings:"",
    limitations_short:"",
    url_or_doi:"",
    tags:"", library:"ERIC"
  },
  {
    paper_id:"JohnsonEtAl_2022", year:2022, title:"Building Strength in Chicago: Setting the Local and National Computer Science Agendas",
    authors:"Johnson et al.", country:"USA", state:"IL",
    grades:[9, 10, 11, 12], population_focus:"Women; Disability",
    study_type:"Review", n_students:null, n_teachers:null, n_sites:null,
    course_or_context:"Classroom", tools:"", language:"",
    outcome_type:"Access", result_direction:"",
    key_findings:"",
    limitations_short:"",
    url_or_doi:"",
    tags:"CS For All", library:"ERIC"
  },
];
