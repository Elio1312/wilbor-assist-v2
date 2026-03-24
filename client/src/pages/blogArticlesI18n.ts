// Multilingual blog articles — EN and ES translations
// PT-BR content is in Blog.tsx (blogArticlesData)

export interface BlogArticleTranslation {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  readTime: string;
}

export const blogArticlesEN: BlogArticleTranslation[] = [
  {
    slug: "baby-wont-sleep",
    title: "Baby Won't Sleep: Complete Guide by Age (0 to 12 Months)",
    excerpt: "Understand sleep windows, bedtime routines, and AAP-backed techniques to help your baby sleep better at every stage.",
    readTime: "8 min read",
    metaTitle: "Baby Won't Sleep: Complete Guide by Age | Wilbor",
    metaDescription: "Baby sleep guide based on AAP protocols. Learn sleep windows, routines, and techniques for 0-12 months.",
    keywords: ["baby sleep", "newborn sleep", "baby sleep schedule", "sleep regression", "baby won't sleep"],
    content: `## Why Won't My Baby Sleep?

Baby sleep is one of the biggest concerns for mothers worldwide. According to the **American Academy of Pediatrics (AAP)**, sleep patterns vary significantly by age, and understanding these phases is the first step toward more peaceful nights.

## Sleep Windows by Age

A **sleep window** is the maximum amount of time your baby can stay awake before becoming irritable and having difficulty falling asleep. Respecting this window is fundamental.

| Age | Sleep Window | Total Sleep/Day | Naps |
|-----|--------------|-----------------|------|
| 0-1 month | 45-60 min | 16-18h | 4-6 |
| 1-2 months | 60-90 min | 15-17h | 4-5 |
| 3-4 months | 75-120 min | 14-16h | 3-4 |
| 5-6 months | 2-2.5h | 14-15h | 2-3 |
| 7-9 months | 2.5-3h | 13-14h | 2 |
| 10-12 months | 3-4h | 12-14h | 1-2 |

## Sleep Cues

Watch for signs that indicate your baby is ready to sleep: rubbing eyes, yawning, fixed gaze, and pulling ears are early signs. Late signs include crying, irritability, jerky movements, and arching back. When you notice late signs, your baby has already passed the ideal window. Try putting them down for sleep at the first signs.

## Techniques to Improve Sleep

### Ideal Environment
Maintain a temperature between 72°F and 75°F (22°C–24°C), use blackout curtains for darkness, incorporate white noise from a fan or app, and always place baby on their back, following AAP recommendations.

### Sleep Routine (starting at 2-3 months)
Begin with a warm bath (not hot), followed by gentle massage with slow movements, feeding in a calm and dark environment, a lullaby or white noise, and finally place baby in crib drowsy but awake.

### Sleep Regression (4 months)
Around 4 months, many babies experience a **sleep regression**. This happens because their sleep pattern is maturing. It's temporary (1-3 weeks) and part of normal development.

## When to Contact Your Pediatrician

- Baby snores or has pauses in breathing during sleep
- Doesn't sleep more than 30 minutes straight after 4 months
- Extreme irritability that doesn't improve with any technique
- Weight loss or feeding refusal associated with sleep issues

---
**Source:** American Academy of Pediatrics (AAP) protocols.`,
  },
  {
    slug: "baby-colic-relief",
    title: "Baby Colic: What to Do to Relieve It (Practical Guide)",
    excerpt: "Proven techniques to soothe colic in newborns. Massage, positions, and what the AAP says about infant crying.",
    readTime: "7 min read",
    metaTitle: "Baby Colic Relief: Proven Techniques | Wilbor",
    metaDescription: "Practical guide to relieve baby colic based on AAP protocols. Massage, positions, and when to call the doctor.",
    keywords: ["baby colic", "infant colic relief", "colic baby", "newborn crying", "baby gas relief"],
    content: `## What Is Baby Colic?

Infant colic affects approximately **20-25% of babies** and is characterized by intense, inconsolable crying, usually in the late afternoon or evening, in healthy, well-fed babies.

According to the **Wessel Rule** (adopted by the AAP), colic is defined as crying for more than **3 hours per day**, more than **3 days per week**, for more than **3 consecutive weeks**.

## Why Do Babies Get Colic?

The causes are not fully understood, but the most accepted theories include:

- **Immature digestive system** — the intestine is still learning to function
- **Intestinal gas** — difficulty eliminating gas
- **Environmental hypersensitivity** — excessive light, sound, and movement stimuli
- **Reflux** — in some cases may be associated
- **Lactose intolerance** — rare but possible

## Techniques to Relieve Colic

### Abdominal Massage (I-L-U)
Make gentle movements on baby's belly with your finger:
1. **I** — vertical movement downward on the right side
2. **L** — horizontal movement from right to left, then down
3. **U** — U-shaped movement, going up on the left side

### Football Hold Position
Lay baby face down on your forearm, with belly supported and head in the crook of your elbow. The slight pressure on the belly helps eliminate gas.

### Heat on the Belly
Place a warm (not hot) folded cloth diaper on baby's belly while holding them.

### Movement and White Noise
- Walk with baby in arms or stroller
- "Shhhh" sounds near baby's ear
- Gentle vibration (car ride, hair dryer far from baby)

### Breastfeeding and Maternal Diet
If breastfeeding, try temporarily reducing:
- Dairy products (main suspect)
- Caffeine (coffee, black tea, sodas)
- Broccoli, cauliflower, cabbage (produce gas)

## What NOT to Do
- ❌ Don't give herbal teas — no evidence and contamination risk
- ❌ Don't give medications without medical prescription
- ❌ Don't shake the baby — risk of shaken baby syndrome

## When to Contact Your Pediatrician
- Crying associated with fever (above 100.4°F / 38°C)
- Baby refuses feeding
- Weight loss
- Blood in stool
- Frequent and intense vomiting
- Colic that worsens after 3-4 months

---
**Source:** American Academy of Pediatrics (AAP).`,
  },
  {
    slug: "baby-fever-guide",
    title: "Baby Fever: When to Go to the Hospital (Guide by Age)",
    excerpt: "Learn when fever is an emergency, how to measure correctly, and AAP guidelines for treating fever at home.",
    readTime: "6 min read",
    metaTitle: "Baby Fever: When to Go to the Hospital | Wilbor",
    metaDescription: "AAP-based guide on baby fever by age. Learn when to go to the ER, how to treat at home, and warning signs.",
    keywords: ["baby fever", "infant fever", "newborn fever", "when to go to hospital baby fever", "baby temperature"],
    content: `## When Is Fever an Emergency?

Fever is a defense mechanism of the body, not a disease. However, in young babies, it can indicate serious infections that need immediate attention.

## Fever Definition by Measurement Method

| Method | Normal Temperature | Fever |
|--------|-------------------|-------|
| Rectal (most accurate) | up to 99.5°F (37.5°C) | ≥ 100.4°F (38°C) |
| Axillary | up to 97.7°F (36.5°C) | ≥ 99.5°F (37.5°C) |
| Oral | up to 98.6°F (37°C) | ≥ 100°F (37.8°C) |
| Tympanic (ear) | up to 99.5°F (37.5°C) | ≥ 100.4°F (38°C) |

**AAP Recommendation:** Use a digital rectal thermometer for the most accurate reading in infants.

## Fever by Age: When to Go to the ER

### Newborn (0-28 days)
**Any fever above 100.4°F (38°C) = emergency.** Go to the ER immediately. Do not wait. Do not give medication before consulting.

### 1-3 months
Fever above **100.4°F (38°C)** = medical consultation within a few hours (don't wait until the next day).

### 3-6 months
- Fever above **102.2°F (39°C)** = medical consultation
- Fever with other symptoms (inconsolable crying, rash, breathing difficulty) = emergency

### 6-12 months
- Fever above **103.1°F (39.5°C)** that doesn't respond to medication
- Fever lasting more than **3 days**
- Any warning sign (see below)

## Warning Signs (Go to the ER Immediately)
- Purple or red spots that don't fade when pressed
- Difficulty breathing or very rapid breathing
- Inconsolable crying for more than 2 hours
- Baby very drowsy, difficult to wake
- Stiff neck
- Seizure
- Bulging fontanelle (soft spot)

## How to Treat Fever at Home

### Medications
- **Acetaminophen (Tylenol):** 10-15mg/kg every 4-6 hours. Can be given from 3 months.
- **Ibuprofen:** 5-10mg/kg every 6-8 hours. Only from 6 months.
- **Never give aspirin** to children — risk of Reye's syndrome.

### Physical Measures
- Light clothing
- Ventilated (not cold) environment
- Offer fluids frequently (breast milk, water from 6 months)
- Lukewarm bath (not cold) — can help reduce discomfort

---
**Source:** American Academy of Pediatrics (AAP).`,
  },
  {
    slug: "baby-food-introduction",
    title: "Baby Food Introduction: Complete Guide (BLW and Traditional)",
    excerpt: "When to start solids, BLW vs traditional method, safe first foods, and allergen introduction based on AAP guidelines.",
    readTime: "10 min read",
    metaTitle: "Baby Food Introduction: Complete Guide | Wilbor",
    metaDescription: "Complete guide to starting solids at 6 months. BLW vs traditional, first foods, allergens, and AAP recommendations.",
    keywords: ["baby food introduction", "starting solids", "BLW baby", "first foods baby", "baby led weaning"],
    content: `## When to Start?

The **World Health Organization (WHO)** and the **American Academy of Pediatrics (AAP)** recommend starting solid foods at **6 months**, while continuing breastfeeding until 2 years or more.

### Readiness Signs (all must be present):
- Holds head steady without support
- Sits with minimal support
- Shows interest in adults' food
- Lost the extrusion reflex (doesn't push everything out with tongue)

## BLW vs. Traditional Method

| Aspect | BLW (Baby-Led Weaning) | Traditional Method |
|---------|------------------------|-------------------|
| Initial texture | Soft food pieces | Purees and mashes |
| Control | Baby controls intake | Parents spoon-feed |
| Autonomy | High from the start | Gradual |
| Choking risk | Equal to traditional (with supervision) | Equal to BLW |
| AAP recommendation | Accepted | Accepted |

**Tip:** You can combine both methods (mixed method or BLISS).

## Foods by Phase

### 6 months — First Foods
- Soft cooked vegetables: carrots, sweet potato, zucchini
- Soft fruits: banana, mango, cooked pear, avocado
- Proteins: shredded chicken, ground beef, well-cooked egg
- Grains: rice, pasta, oatmeal

### 7-8 months — Expanding Variety
- Introduce one new food every 3-5 days
- Legumes: beans, lentils, chickpeas (mashed)
- Fish: tilapia, salmon (boneless)
- Plain whole-milk yogurt

### 9-12 months — Family Texture
- Gradually move to family food texture
- Avoid only: honey, excess salt, sugar, fried foods

## Foods Prohibited Before 1 Year

| Food | Reason |
|------|--------|
| Honey | Risk of infant botulism |
| Cow's milk as main drink | Hard to digest protein, low in iron |
| Salt | Immature kidneys |
| Sugar | Poor eating habits, cavities |
| Ultra-processed foods | Harmful additives |
| Whole peanuts | Choking risk |
| Large fish (tuna, swordfish) | High mercury content |

## Allergens: Introduce Early!

Contrary to previous belief, early allergen introduction **reduces** allergy risk. Introduce individually, with 3-day intervals:
- Egg (white and yolk)
- Peanut (paste/butter)
- Cow's milk (in preparations)
- Wheat
- Fish
- Soy

## Gagging vs. Choking

**Gagging:** baby makes sounds, turns red, but is controlling the food. It is **normal and safe** — don't interfere.

**Real choking:** baby turns blue/purple, no sound, can't breathe. **Act immediately** with infant Heimlich maneuver.

---
**Source:** WHO, American Academy of Pediatrics (AAP).`,
  },
  {
    slug: "postpartum-depression",
    title: "Postpartum Depression: Signs, When to Seek Help, and What to Do",
    excerpt: "Postpartum depression affects 10-20% of mothers. Learn the signs, risk factors, and where to find help.",
    readTime: "8 min read",
    metaTitle: "Postpartum Depression: Signs and Help | Wilbor",
    metaDescription: "Complete guide on postpartum depression. Signs, risk factors, treatment, and where to find free help.",
    keywords: ["postpartum depression", "baby blues", "PPD symptoms", "postpartum anxiety", "new mom depression"],
    content: `## You Are Not Alone

**Postpartum depression (PPD)** affects between **10% and 20% of mothers** worldwide, according to WHO. It is a real medical condition, not a character weakness.

## Baby Blues vs. Postpartum Depression

| Characteristic | Baby Blues | Postpartum Depression |
|----------------|------------|----------------------|
| Onset | 2-3 days after birth | 2-8 weeks after birth |
| Duration | Up to 2 weeks | Months without treatment |
| Intensity | Mild to moderate | Moderate to severe |
| Functionality | Maintained | Compromised |
| Treatment | Support and rest | Professional needed |

## Signs of Postpartum Depression

- Persistent sadness, frequent crying without apparent reason
- Feelings of guilt or inadequacy as a mother
- Thoughts that the baby would be better off without you
- Intense anxiety, panic attacks
- Difficulty bonding with the baby
- Social isolation (refusing visitors, not leaving home)
- Loss of interest in previously enjoyed activities
- Difficulty concentrating

## Risk Factors

- Personal or family history of depression
- Unplanned pregnancy
- Lack of support network
- Birth complications
- Premature baby or baby with health problems
- Financial difficulties
- Domestic violence

## What to Do

### For the Mother
1. **Recognize you need help** — it's not weakness
2. **Talk to someone** — partner, mother, friend, professional
3. **Seek a therapist or psychiatrist** — many insurance plans cover mental health
4. **Don't stop medication on your own** if already in treatment
5. **Accept practical help** — let someone care for the baby while you rest

### For Those Around Her
1. **Don't minimize** ("it'll pass", "it's just tiredness")
2. **Offer concrete help** (cooking, cleaning, caring for baby)
3. **Encourage seeking professional help**
4. **Be present** without judgment

## Where to Get Help (USA)
- **Postpartum Support International:** 1-800-944-4773 or postpartum.net
- **SAMHSA National Helpline:** 1-800-662-4357 (free, confidential)
- **Crisis Text Line:** Text HOME to 741741
- **National Suicide Prevention Lifeline:** 988

## Treatment

- **Psychotherapy** (cognitive-behavioral therapy is most studied)
- **Medication** (antidepressants safe for breastfeeding exist)
- **Support groups** (sharing experiences with other mothers helps)
- **Physical exercise** (light walks make a difference)

---
**Source:** WHO, American Academy of Pediatrics (AAP).`,
  },
  {
    slug: "baby-vaccination-schedule",
    title: "Baby Vaccination Schedule: Complete Calendar and Expected Reactions",
    excerpt: "Complete CDC/AAP vaccination schedule for 0-12 months, expected reactions, and when to call the doctor.",
    readTime: "7 min read",
    metaTitle: "Baby Vaccination Schedule: Complete Guide | Wilbor",
    metaDescription: "Complete CDC/AAP vaccination schedule for babies 0-12 months. Expected reactions and when to seek medical care.",
    keywords: ["baby vaccination schedule", "infant vaccines", "CDC vaccine schedule", "baby shots", "newborn vaccines"],
    content: `## Baby Vaccination Schedule (0-12 months)

The **CDC/AAP recommended immunization schedule** provides the best protection for your baby. Most vaccines are covered by insurance and available free at community health centers.

## Vaccines by Age

| Age | Vaccine | Protects Against |
|-----|---------|-----------------|
| Birth | HepB (1st dose) | Hepatitis B |
| 2 months | DTaP (1st dose) | Diphtheria, tetanus, whooping cough |
| 2 months | IPV (1st dose) | Polio |
| 2 months | Hib (1st dose) | Haemophilus influenzae type b |
| 2 months | PCV15/PCV20 (1st dose) | Pneumococcal disease |
| 2 months | RV (1st dose) | Rotavirus |
| 4 months | DTaP, IPV, Hib, PCV, RV (2nd doses) | Boosters |
| 6 months | DTaP, IPV, HepB (3rd doses) | Boosters |
| 6 months | Flu (annual) | Influenza |
| 12 months | MMR (1st dose) | Measles, mumps, rubella |
| 12 months | Varicella (1st dose) | Chickenpox |
| 12 months | HepA (1st dose) | Hepatitis A |

## Expected Reactions (Normal)

After vaccination, it's common for baby to have:
- **Low-grade fever** (up to 101.3°F/38.5°C) in the first 24-48 hours
- **Redness and swelling** at the injection site
- **Irritability** and more frequent crying
- **Drowsiness** or appetite changes

### How to Relieve
- **Cold compress** at the injection site (no direct ice)
- **Acetaminophen** at the dose prescribed by the pediatrician (if fever above 100.4°F/38°C)
- **Breastfeed** more frequently (comfort + hydration)
- **Light clothing** and cool environment

## When to Contact Pediatrician After Vaccine
- Fever above **104°F (40°C)** or lasting more than 48 hours
- **Inconsolable crying** for more than 3 hours
- **Seizure**
- **Extensive swelling** in the vaccinated limb
- **Purple spots** on the body

## Frequently Asked Questions

### Can a sick baby get vaccinated?
If it's a mild cold (runny nose, mild cough, no fever), **yes, vaccinate**. With fever or moderate/severe illness, postpone until recovery.

### Do premature babies follow the same schedule?
Yes, premature babies follow the schedule by **chronological age** (date of birth).

---
**Source:** CDC, American Academy of Pediatrics (AAP).`,
  },
  {
    slug: "breastfeeding-latch-guide",
    title: "Breastfeeding: Correct Latch, Positions, and Common Difficulties",
    excerpt: "Master the correct latch, best breastfeeding positions, and solutions to common challenges like engorgement and mastitis.",
    readTime: "9 min read",
    metaTitle: "Breastfeeding Latch Guide: Positions and Tips | Wilbor",
    metaDescription: "Complete breastfeeding guide: correct latch, positions, engorgement, mastitis, and low milk supply solutions.",
    keywords: ["breastfeeding latch", "breastfeeding positions", "breastfeeding tips", "mastitis", "low milk supply"],
    content: `## The Importance of Breastfeeding

**Breast milk** is the ideal food for babies in the first 6 months of life. The WHO and AAP recommend:
- **Exclusive breastfeeding** until 6 months (no water, teas, or other foods)
- **Complementary breastfeeding** until 2 years or more

Proven benefits:
- Reduces risk of sudden infant death syndrome by 50%
- Protects against respiratory infections and diarrhea
- Reduces risk of obesity, diabetes, and allergies
- Strengthens mother-baby bond

## The Correct Latch

An incorrect latch is the main cause of breastfeeding pain and low milk production.

### Signs of Correct Latch ✓
- Mouth wide open (120° angle or more)
- Lower lip turned outward
- Chin touching the breast
- More areola visible above than below the mouth
- Rounded cheeks (not sunken)
- You hear swallowing, not clicking

### Signs of Incorrect Latch ✗
- Intense pain throughout the entire feeding
- Nipple flattened or with marks when released
- Baby makes clicking sounds
- Sunken cheeks
- Baby seems frustrated and frequently releases the breast

### How to Correct the Latch
1. Insert your little finger in the corner of baby's mouth to break the suction
2. Reposition: bring baby close, belly to belly
3. Wait for mouth to open wide before latching
4. Direct the nipple toward the palate (roof of mouth), not the tongue

## Breastfeeding Positions

### Cradle Hold (Classic)
Baby lying on your arm, belly to belly. Good for older babies.

### Football Hold
Baby at your side, under your arm, with legs behind. Excellent for:
- Post-cesarean (avoids pressure on abdomen)
- Premature babies
- Large breasts

### Side-Lying Position
Mother and baby lying on their sides, face to face. Ideal for night feedings.

### Reclined Position (Biological Nurturing)
Mother reclined, baby lying on top. Takes advantage of baby's rooting reflex.

## Common Difficulties

### Engorgement (Hard, Swollen Breasts)
Occurs in the first days when milk "comes in."
- **Relief:** breastfeed frequently, warm compress before, cold compress after
- **Don't:** express too much milk (worsens engorgement)

### Nipple Cracks/Soreness
- Check the latch — it's the most common cause
- Apply breast milk to the nipple after feeding and let dry
- Use pure lanolin (Lansinoh) if necessary
- Don't use soap on the nipple

### Mastitis
Breast inflammation with fever and intense pain.
- Continue breastfeeding (doesn't harm baby)
- Warm compress and gentle massage
- See your doctor — may need antibiotics

### Low Milk Supply
In most cases, production is sufficient. Signs baby is well-nourished:
- 6+ wet diapers per day
- Gaining weight as expected
- Active and satisfied after feedings

To increase production: breastfeed more often, fully empty the breast, stay well-hydrated.

---
**Source:** WHO, American Academy of Pediatrics (AAP), UNICEF.`,
  },
  {
    slug: "baby-safety-home",
    title: "Baby Safety at Home: Accident Prevention by Age",
    excerpt: "Room-by-room safety checklist, prevention by accident type, and what to do in emergencies — AAP guidelines.",
    readTime: "8 min read",
    metaTitle: "Baby Safety at Home: Complete Checklist | Wilbor",
    metaDescription: "Complete baby safety guide by room and age. Prevent falls, choking, poisoning, and drowning with AAP guidelines.",
    keywords: ["baby safety", "baby proofing", "infant safety home", "baby accident prevention", "childproofing"],
    content: `## Domestic Accidents: The Leading Preventable Cause of Death

Domestic accidents are the **leading preventable cause of death** in children under 5. The good news: most are 100% preventable.

## Room-by-Room Checklist

### Baby's Room ✓
- [ ] Crib with firm rails (maximum 2.375 inches / 6cm between slats)
- [ ] Firm mattress, no pillow, no bumpers, no stuffed animals in crib
- [ ] Baby always sleeps on back (face up)
- [ ] Room temperature between 68-72°F (20-22°C)
- [ ] Baby monitor installed
- [ ] Outlet covers
- [ ] Curtains without cords (strangulation risk)

### Kitchen ✓
- [ ] Locks on low drawers and cabinets
- [ ] Pot handles always turned inward
- [ ] Cleaning products in high cabinet with lock
- [ ] Trash with lid and inaccessible location
- [ ] Stove and oven with protection

### Bathroom ✓
- [ ] Never leave baby alone in the tub (not even for 1 second)
- [ ] Non-slip mat in tub and on floor
- [ ] Water temperature: 98-100°F / 37-38°C (test with elbow)
- [ ] Medications in high cabinet with lock
- [ ] Hygiene products out of reach

### Living Room and Hallways ✓
- [ ] Safety gates at stairs (top and bottom)
- [ ] Furniture corner protectors
- [ ] Small objects out of reach (choking risk)
- [ ] Toxic plants removed or inaccessible
- [ ] Electrical cords organized and out of reach

## Prevention by Accident Type

### Falls (most common at 6-12 months)
- Never leave baby on elevated surface without supervision
- Use playpen on floor for playtime
- Install gates at stairs before baby starts crawling

### Choking (risk increases with food introduction)
High-risk foods: whole grapes, cherries, whole peanuts, raw carrots, raw apple in large pieces, hot dogs.
- Always cut into small pieces or remove skin
- Learn infant Heimlich maneuver

### Drowning
- Never leave alone in the tub
- Empty inflatable pools after use
- Risk in buckets, basins, toilets

### Poisoning
- Medications are the leading cause
- Store EVERYTHING in a high, locked location
- **Poison Control Center: 1-800-222-1222** (USA, 24/7)

---
**Source:** American Academy of Pediatrics (AAP).`,
  },
  {
    slug: "baby-developmental-leaps",
    title: "Baby Developmental Leaps: What to Expect Month by Month",
    excerpt: "Understand developmental milestones, wonder weeks, and how to support your baby through each leap.",
    readTime: "9 min read",
    metaTitle: "Baby Developmental Leaps: Month by Month Guide | Wilbor",
    metaDescription: "Complete guide to baby developmental milestones and wonder weeks. What to expect from 1-12 months.",
    keywords: ["baby developmental leaps", "wonder weeks", "baby milestones", "infant development", "baby growth spurts"],
    content: `## What Are Developmental Leaps?

**Developmental leaps** (also called growth spurts or wonder weeks) are periods when babies go through intense neurological changes. During these periods, it's common to see:
- Excessive crying and irritability
- Sleep regression
- Increased demand for holding and attention
- Temporary feeding refusal

**Important:** These periods are temporary and indicate your baby is developing normally.

## Developmental Milestones by Month

### 1 Month
- Focuses gaze on faces (especially at 8-12 inches / 20-30cm)
- Reacts to loud sounds
- Reflex movements (sucking, grasping)

### 2 Months
- **First social smile** (not gas!)
- Begins vocalizing ("ah", "oh")
- Follows objects with eyes

### 3 Months
- Holds head up for longer periods
- Smiles in response to adult's smile
- Recognizes familiar voices

### 4 Months
- **Sleep regression** (important neurological milestone)
- Laughs out loud
- Tries to reach for objects

### 5-6 Months
- Sits with support
- Transfers objects from one hand to another
- Recognizes own name

### 7-8 Months
- **Separation anxiety** begins
- Crawls (some babies skip this phase)
- Imitates sounds and gestures

### 9-10 Months
- Stands with support
- Pincer grasp (picks up small objects with thumb and index finger)
- Understands "no" and "bye-bye"

### 11-12 Months
- First steps (can vary from 9-18 months — normal)
- First words ("mama", "dada", "water")
- Points to what they want

## When to Consult the Pediatrician

Talk to your pediatrician if baby does **not** show by:
- 2 months: doesn't focus gaze
- 3 months: no social smile
- 4 months: doesn't hold head up
- 6 months: doesn't sit with support, doesn't vocalize
- 9 months: doesn't interact, doesn't imitate
- 12 months: doesn't point, doesn't say any words

## How to Support Baby During Leaps

- **More holding and physical contact** — won't "spoil"
- **Predictable routine** — helps create security
- **Appropriate stimulation** — not excessive
- **Patience** — the phase passes, usually in 1-2 weeks

---
**Source:** American Academy of Pediatrics (AAP) and infant development research.`,
  },
  {
    slug: "newborn-bath-guide",
    title: "Newborn Bath: Safe Step-by-Step Guide",
    excerpt: "When to give the first bath, correct water temperature, umbilical cord care, and newborn skin tips.",
    readTime: "6 min read",
    metaTitle: "Newborn Bath Guide: Safe Step-by-Step | Wilbor",
    metaDescription: "Complete newborn bath guide. When to start, correct temperature, umbilical cord care, and safety tips.",
    keywords: ["newborn bath", "baby first bath", "how to bathe newborn", "umbilical cord care", "newborn skin care"],
    content: `## The First Bath: When and How

The **WHO and AAP** recommend waiting at least **24 hours** after birth for the first bath. This preserves the vernix caseosa (white substance that protects baby's skin) and prevents hypothermia.

## Bath Frequency

- **Newborn (0-4 weeks):** 2-3 times per week is sufficient
- **From 1 month:** can be daily if family prefers
- **Essential daily hygiene:** clean face, neck, armpits, and diaper area

## Preparation Before the Bath

### Necessary Materials
- Baby bathtub (or basin)
- Water thermometer (or elbow to test)
- Soft, warmed towel
- Neutral soap and shampoo (pH 5.5, fragrance-free)
- Clean diaper and clothes ready
- Cotton for umbilical cord hygiene (if not yet fallen)

### Ideal Temperature
- **Water:** 98-100°F / 37-38°C (warm, not hot — test with elbow)
- **Room:** 75-79°F / 24-26°C (close windows, no draft)

## Step-by-Step Bath

1. **Prepare everything** before picking up baby
2. Undress baby and wrap in towel
3. Wash **face first** with damp cotton (no soap)
4. Wash **hair** with baby still in towel (football hold position)
5. Place baby in tub with **one hand always supporting the head**
6. Wash from **neck downward**, leaving genital area for last
7. **Remove quickly** and wrap in warmed towel
8. Dry all folds well (neck, armpits, groin, toes)

## Special Care

### Umbilical Cord Stump
- Keep dry and exposed to air
- Don't cover with diaper
- Falls naturally in 7-21 days
- Warning sign: redness, discharge with bad smell, bleeding

### Newborn Skin
- **Peeling** in the first days is normal
- **Erythema toxicum** (red spots with white center) is normal and passes
- **Milia** (white dots on nose) is normal and passes
- Don't use talcum powder (inhalation risk)
- Moisturizer: only if recommended by pediatrician

### Genital Hygiene
**Girls:** always clean front to back, never the opposite.
**Boys:** don't force the foreskin back — this is normal until ages 3-4.

## Bath Safety

- **Never leave baby alone**, not even for a second
- Empty the tub immediately after bath
- Always hold firmly — wet babies are slippery
- If the phone rings, ignore it or take baby with you

---
**Source:** WHO, American Academy of Pediatrics (AAP).`,
  },
];

export const blogArticlesES: BlogArticleTranslation[] = [
  {
    slug: "bebe-no-duerme",
    title: "Bebé No Duerme: Guía Completa por Edad (0 a 12 Meses)",
    excerpt: "Entiende las ventanas de sueño, rutinas y técnicas basadas en la OMS para ayudar a tu bebé a dormir mejor.",
    readTime: "8 min de lectura",
    metaTitle: "Bebé No Duerme: Guía Completa por Edad | Wilbor",
    metaDescription: "Guía de sueño del bebé basada en protocolos OMS/AAP. Aprende ventanas de sueño, rutinas y técnicas para 0-12 meses.",
    keywords: ["sueño del bebé", "bebé no duerme", "rutina de sueño bebé", "regresión del sueño", "bebé recién nacido sueño"],
    content: `## ¿Por qué mi bebé no duerme?

El sueño del bebé es una de las mayores preocupaciones de las madres en todo el mundo. Según la **Organización Mundial de la Salud (OMS)**, los patrones de sueño varían significativamente según la edad, y entender estas fases es el primer paso hacia noches más tranquilas.

## Ventanas de sueño por edad

Una **ventana de sueño** es el tiempo máximo que tu bebé puede permanecer despierto antes de irritarse y tener dificultad para dormir. Respetar esta ventana es fundamental.

| Edad | Ventana de sueño | Sueño total/día | Siestas |
|------|------------------|-----------------|---------|
| 0-1 mes | 45-60 min | 16-18h | 4-6 |
| 1-2 meses | 60-90 min | 15-17h | 4-5 |
| 3-4 meses | 75-120 min | 14-16h | 3-4 |
| 5-6 meses | 2-2,5h | 14-15h | 2-3 |
| 7-9 meses | 2,5-3h | 13-14h | 2 |
| 10-12 meses | 3-4h | 12-14h | 1-2 |

## Señales de sueño

Observa las señales que indican que tu bebé está listo para dormir: frotarse los ojos, bostezar, mirada fija y tirarse de la oreja son señales iniciales. Las señales tardías incluyen llanto, irritabilidad, movimientos bruscos y arqueamiento de la espalda.

## Técnicas para mejorar el sueño

### Ambiente ideal
Mantén una temperatura entre 22°C y 24°C, usa cortinas opacas para la oscuridad, incorpora ruido blanco de un ventilador o aplicación, y coloca siempre al bebé boca arriba, siguiendo las recomendaciones de la OMS/AAP.

### Rutina de sueño (a partir de 2-3 meses)
Comienza con un baño tibio, seguido de un masaje suave, alimentación en ambiente tranquilo y oscuro, una canción de cuna o ruido blanco, y finalmente coloca al bebé en la cuna somnoliento pero despierto.

### Regresión del sueño (4 meses)
Alrededor de los 4 meses, muchos bebés experimentan una **regresión del sueño**. Es temporal (1-3 semanas) y parte del desarrollo normal.

## Cuándo consultar al pediatra

- El bebé ronca o tiene pausas en la respiración
- No duerme más de 30 minutos seguidos después de los 4 meses
- Irritabilidad extrema que no mejora con ninguna técnica
- Pérdida de peso o rechazo alimentario asociado

---
**Fuente:** Protocolos de la OMS y American Academy of Pediatrics (AAP).`,
  },
  {
    slug: "colico-del-bebe",
    title: "Cólico del Bebé: Qué Hacer para Aliviar (Guía Práctica)",
    excerpt: "Técnicas probadas para aliviar el cólico del recién nacido. Masajes, posiciones y qué dice la OMS sobre el llanto infantil.",
    readTime: "7 min de lectura",
    metaTitle: "Cólico del Bebé: Técnicas para Aliviar | Wilbor",
    metaDescription: "Guía práctica para aliviar el cólico del bebé. Masajes, posiciones y cuándo llamar al médico.",
    keywords: ["cólico del bebé", "bebé con cólico", "aliviar cólico bebé", "llanto bebé", "gases bebé"],
    content: `## ¿Qué es el cólico del bebé?

El cólico infantil afecta aproximadamente al **20-25% de los bebés** y se caracteriza por llanto intenso e inconsolable, generalmente al final de la tarde o por la noche, en bebés sanos y bien alimentados.

Según la **Regla de Wessel** (adoptada por la OMS y AAP), se considera cólico cuando el bebé llora más de **3 horas al día**, más de **3 días a la semana**, durante más de **3 semanas consecutivas**.

## Técnicas para aliviar el cólico

### Masaje abdominal (I-L-U)
Realiza movimientos suaves en la barriga del bebé con el dedo:
1. **I** — movimiento vertical hacia abajo en el lado derecho
2. **L** — movimiento horizontal de derecha a izquierda, luego baja
3. **U** — movimiento en U, subiendo por el lado izquierdo

### Posición de avión
Acuesta al bebé boca abajo en tu antebrazo, con la barriga apoyada y la cabeza en el pliegue del codo. La leve presión en la barriga ayuda a eliminar gases.

### Calor en la barriga
Coloca un pañal tibio (no caliente) doblado sobre la barriga del bebé mientras lo sostienes.

### Movimiento y ruido blanco
- Camina con el bebé en brazos o en el cochecito
- Sonidos de "shhhh" cerca del oído del bebé
- Vibración suave (paseo en coche)

## Qué NO hacer
- ❌ No des infusiones de hierbas — sin evidencia y riesgo de contaminación
- ❌ No des medicamentos sin prescripción médica
- ❌ No sacudas al bebé — riesgo de síndrome del bebé sacudido

## Cuándo consultar al pediatra
- Llanto asociado a fiebre (por encima de 38°C)
- El bebé rechaza la alimentación
- Pérdida de peso
- Sangre en las heces
- Vómitos frecuentes e intensos

---
**Fuente:** OMS y American Academy of Pediatrics (AAP).`,
  },
  {
    slug: "fiebre-en-bebe",
    title: "Fiebre en el Bebé: Cuándo Ir al Hospital (Guía por Edad)",
    excerpt: "Aprende cuándo la fiebre es una emergencia, cómo medir correctamente y las pautas de la OMS para tratar la fiebre en casa.",
    readTime: "6 min de lectura",
    metaTitle: "Fiebre en el Bebé: Cuándo Ir al Hospital | Wilbor",
    metaDescription: "Guía de fiebre en bebés por edad. Cuándo ir a urgencias, cómo tratar en casa y señales de alarma.",
    keywords: ["fiebre bebé", "temperatura bebé", "bebé con fiebre", "fiebre recién nacido", "cuándo ir al hospital bebé"],
    content: `## ¿Cuándo es la fiebre una emergencia?

La fiebre es un mecanismo de defensa del organismo, no una enfermedad. Sin embargo, en bebés pequeños puede indicar infecciones graves que necesitan atención inmediata.

## Definición de fiebre por método de medición

| Método | Temperatura normal | Fiebre |
|--------|-------------------|--------|
| Rectal (más preciso) | hasta 37,5°C | ≥ 38°C |
| Axilar | hasta 36,5°C | ≥ 37,5°C |
| Oral | hasta 37°C | ≥ 37,8°C |
| Timpánico (oído) | hasta 37,5°C | ≥ 38°C |

## Fiebre por edad: cuándo ir a urgencias

### Recién nacido (0-28 días)
**Cualquier fiebre por encima de 38°C = emergencia.** Ve a urgencias inmediatamente. No esperes.

### 1-3 meses
Fiebre por encima de **38°C** = consulta médica en pocas horas.

### 3-6 meses
- Fiebre por encima de **39°C** = consulta médica
- Fiebre con otros síntomas = emergencia

### 6-12 meses
- Fiebre por encima de **39,5°C** que no cede con medicamento
- Fiebre que dura más de **3 días**

## Señales de alarma (ve a urgencias inmediatamente)
- Manchas moradas o rojas que no desaparecen al presionar
- Dificultad para respirar
- Llanto inconsolable por más de 2 horas
- Bebé muy somnoliento, difícil de despertar
- Cuello rígido
- Convulsión

## Cómo tratar la fiebre en casa

### Medicamentos
- **Paracetamol:** 10-15mg/kg cada 4-6 horas. Puede darse a partir de los 3 meses.
- **Ibuprofeno:** 5-10mg/kg cada 6-8 horas. Solo a partir de los 6 meses.
- **Nunca des aspirina** a niños — riesgo de síndrome de Reye.

---
**Fuente:** OMS y American Academy of Pediatrics (AAP).`,
  },
  {
    slug: "introduccion-alimentaria",
    title: "Introducción Alimentaria: Guía Completa para Empezar (BLW y Tradicional)",
    excerpt: "Cuándo empezar, BLW vs método tradicional, primeros alimentos seguros e introducción de alérgenos según la OMS.",
    readTime: "10 min de lectura",
    metaTitle: "Introducción Alimentaria: Guía Completa | Wilbor",
    metaDescription: "Guía completa para iniciar la alimentación complementaria a los 6 meses. BLW vs tradicional, primeros alimentos y alérgenos.",
    keywords: ["introducción alimentaria", "alimentación complementaria", "BLW bebé", "primeros alimentos bebé", "baby led weaning"],
    content: `## ¿Cuándo empezar?

La **Organización Mundial de la Salud (OMS)** y la **AAP** recomiendan iniciar la alimentación complementaria a los **6 meses completos**, manteniendo la lactancia materna hasta los 2 años o más.

### Señales de preparación (todas deben estar presentes):
- Sostiene la cabeza sin apoyo
- Se sienta con apoyo mínimo
- Muestra interés por la comida de los adultos
- Perdió el reflejo de extrusión

## BLW vs. Método Tradicional

| Aspecto | BLW (Baby-Led Weaning) | Método Tradicional |
|---------|------------------------|-------------------|
| Textura inicial | Trozos de alimentos blandos | Papillas y purés |
| Control | El bebé controla cuánto come | Los padres dan con cuchara |
| Autonomía | Alta desde el inicio | Gradual |
| Recomendación OMS | Aceptado | Aceptado |

## Alimentos por fase

### 6 meses — Primeros alimentos
- Verduras cocidas blandas: zanahoria, papa, calabacín
- Frutas blandas: plátano, mango, pera cocida, aguacate
- Proteínas: pollo desmenuzado, carne molida, huevo bien cocido
- Cereales: arroz, pasta, avena

## Alimentos prohibidos antes de 1 año

| Alimento | Motivo |
|----------|--------|
| Miel | Riesgo de botulismo infantil |
| Leche de vaca como bebida principal | Proteína difícil de digerir |
| Sal | Riñones inmaduros |
| Azúcar | Malos hábitos alimentarios |

## ¡Alérgenos: introduce temprano!

La introducción temprana de alérgenos **reduce** el riesgo de alergia. Introduce individualmente, con intervalo de 3 días: huevo, maní (pasta), leche de vaca, trigo, pescado, soja.

---
**Fuente:** OMS y American Academy of Pediatrics (AAP).`,
  },
  {
    slug: "depresion-posparto",
    title: "Depresión Posparto: Señales, Cuándo Buscar Ayuda y Qué Hacer",
    excerpt: "La depresión posparto afecta al 10-20% de las madres. Aprende las señales, factores de riesgo y dónde encontrar ayuda.",
    readTime: "8 min de lectura",
    metaTitle: "Depresión Posparto: Señales y Ayuda | Wilbor",
    metaDescription: "Guía completa sobre depresión posparto. Señales, factores de riesgo, tratamiento y dónde encontrar ayuda.",
    keywords: ["depresión posparto", "baby blues", "síntomas depresión posparto", "ansiedad posparto", "depresión nueva mamá"],
    content: `## No estás sola

La **depresión posparto (DPP)** afecta entre el **10% y el 20% de las madres** en todo el mundo, según la OMS. Es una condición médica real, no una debilidad de carácter.

## Baby Blues vs. Depresión Posparto

| Característica | Baby Blues | Depresión Posparto |
|----------------|------------|-------------------|
| Inicio | 2-3 días después del parto | 2-8 semanas después del parto |
| Duración | Hasta 2 semanas | Meses sin tratamiento |
| Intensidad | Leve a moderada | Moderada a grave |
| Tratamiento | Apoyo y descanso | Profesional necesario |

## Señales de la depresión posparto

- Tristeza persistente, llanto frecuente sin motivo aparente
- Sentimiento de culpa o inadecuación como madre
- Pensamientos de que el bebé estaría mejor sin ti
- Ansiedad intensa, ataques de pánico
- Dificultad para conectar con el bebé
- Aislamiento social

## Dónde buscar ayuda
- **Línea de crisis local** — consulta los recursos de tu país
- **Médico de familia o ginecólogo** — primer punto de contacto
- **Grupos de apoyo para madres** — compartir experiencias ayuda mucho

## Tratamiento

- **Psicoterapia** (terapia cognitivo-conductual es la más estudiada)
- **Medicación** (existen antidepresivos seguros para la lactancia)
- **Grupos de apoyo**
- **Ejercicio físico** (caminatas ligeras ya hacen diferencia)

---
**Fuente:** OMS y American Academy of Pediatrics (AAP).`,
  },
  {
    slug: "vacunas-del-bebe",
    title: "Vacunas del Bebé: Calendario Completo y Reacciones Esperadas",
    excerpt: "Calendario de vacunación OMS/PAHO para 0-12 meses, reacciones esperadas y cuándo llamar al médico.",
    readTime: "7 min de lectura",
    metaTitle: "Vacunas del Bebé: Calendario Completo | Wilbor",
    metaDescription: "Calendario de vacunación para bebés 0-12 meses según OMS. Reacciones esperadas y cuándo buscar atención médica.",
    keywords: ["vacunas bebé", "calendario vacunación bebé", "vacunas recién nacido", "reacciones vacunas bebé", "esquema vacunación infantil"],
    content: `## Calendario de vacunación del bebé (0-12 meses)

El calendario de vacunación recomendado por la **OMS/PAHO** proporciona la mejor protección para tu bebé.

## Vacunas por edad

| Edad | Vacuna | Protege contra |
|------|--------|----------------|
| Al nacer | HepB (1ª dosis) | Hepatitis B |
| 2 meses | DTaP (1ª dosis) | Difteria, tétanos, tos ferina |
| 2 meses | IPV (1ª dosis) | Poliomielitis |
| 2 meses | Hib (1ª dosis) | Haemophilus influenzae tipo b |
| 2 meses | Neumocócica (1ª dosis) | Neumonía, meningitis |
| 2 meses | Rotavirus (1ª dosis) | Diarrea por rotavirus |
| 6 meses | Influenza (anual) | Gripe |
| 12 meses | Triple Viral (1ª dosis) | Sarampión, paperas, rubéola |
| 12 meses | Varicela (1ª dosis) | Varicela |

## Reacciones esperadas (normales)

- **Fiebre leve** (hasta 38,5°C) en las primeras 24-48 horas
- **Enrojecimiento e hinchazón** en el lugar de la inyección
- **Irritabilidad** y llanto más frecuente
- **Somnolencia** o cambios en el apetito

## Cuándo consultar al pediatra después de la vacuna
- Fiebre por encima de **39,5°C** o que dura más de 48 horas
- **Llanto inconsolable** por más de 3 horas
- **Convulsión**
- **Hinchazón extensa** en el miembro vacunado

---
**Fuente:** OMS, PAHO y American Academy of Pediatrics (AAP).`,
  },
  {
    slug: "lactancia-agarre-correcto",
    title: "Lactancia Materna: Agarre Correcto, Posiciones y Dificultades Comunes",
    excerpt: "Domina el agarre correcto, las mejores posiciones para amamantar y soluciones a problemas como la mastitis y el bajo suministro.",
    readTime: "9 min de lectura",
    metaTitle: "Guía de Lactancia: Agarre y Posiciones | Wilbor",
    metaDescription: "Guía completa de lactancia materna: agarre correcto, posiciones, ingurgitación, mastitis y bajo suministro de leche.",
    keywords: ["lactancia materna", "agarre correcto lactancia", "posiciones lactancia", "mastitis", "poca leche materna"],
    content: `## La importancia de la lactancia materna

La **leche materna** es el alimento ideal para el bebé en los primeros 6 meses de vida. La OMS y la AAP recomiendan:
- **Lactancia exclusiva** hasta los 6 meses
- **Lactancia complementada** hasta los 2 años o más

## El agarre correcto

Un agarre incorrecto es la principal causa de dolor en la lactancia y baja producción de leche.

### Señales de agarre correcto ✓
- Boca bien abierta (ángulo de 120° o más)
- Labio inferior hacia afuera
- Mentón tocando el pecho
- Más areola visible arriba que abajo de la boca
- Mejillas redondeadas (no hundidas)
- Escuchas deglución, no chasquidos

### Señales de agarre incorrecto ✗
- Dolor intenso durante toda la toma
- Pezón aplastado o con marcas al salir
- El bebé hace ruidos de chasquido
- Mejillas hundidas

## Posiciones para amamantar

### Posición de cuna (clásica)
Bebé acostado en tu brazo, barriga con barriga. Buena para bebés más grandes.

### Posición de balón de fútbol americano
Bebé a tu lado, bajo el brazo, con las piernas hacia atrás. Excelente para:
- Post-cesárea
- Bebés prematuros
- Pechos grandes

### Posición acostada
Madre y bebé acostados de lado, frente a frente. Ideal para tomas nocturnas.

## Dificultades comunes

### Ingurgitación (pecho duro)
- **Alivio:** amamanta con frecuencia, compresa tibia antes, compresa fría después

### Grietas en el pezón
- Verifica el agarre — es la causa más común
- Aplica leche materna en el pezón después de la toma

### Mastitis
- Continúa amamantando (no perjudica al bebé)
- Compresa tibia y masaje suave
- Consulta al médico — puede necesitar antibióticos

---
**Fuente:** OMS, AAP y UNICEF.`,
  },
  {
    slug: "seguridad-bebe-hogar",
    title: "Seguridad del Bebé en Casa: Prevención de Accidentes por Edad",
    excerpt: "Lista de verificación de seguridad por habitación, prevención por tipo de accidente y qué hacer en emergencias.",
    readTime: "8 min de lectura",
    metaTitle: "Seguridad del Bebé en Casa: Lista Completa | Wilbor",
    metaDescription: "Guía completa de seguridad del bebé por habitación y edad. Previene caídas, asfixia, intoxicación y ahogamiento.",
    keywords: ["seguridad bebé", "prevención accidentes bebé", "babyproof hogar", "seguridad infantil", "accidentes domésticos bebé"],
    content: `## Accidentes domésticos: la principal causa de muerte evitable

Los accidentes domésticos son la **principal causa de muerte evitable** en niños menores de 5 años. La buena noticia: la mayoría son 100% prevenibles.

## Lista de verificación por habitación

### Habitación del bebé ✓
- [ ] Cuna con barrotes firmes (máximo 6cm entre barrotes)
- [ ] Colchón firme, sin almohada, sin cojines, sin peluches en la cuna
- [ ] El bebé siempre duerme boca arriba
- [ ] Temperatura de la habitación entre 20-22°C
- [ ] Monitor de bebé instalado
- [ ] Protectores de enchufes
- [ ] Cortinas sin cordones (riesgo de estrangulamiento)

### Cocina ✓
- [ ] Seguros en cajones y armarios bajos
- [ ] Mangos de las ollas siempre hacia adentro
- [ ] Productos de limpieza en armario alto con seguro

### Baño ✓
- [ ] Nunca dejes al bebé solo en la bañera (ni un segundo)
- [ ] Alfombra antideslizante en la bañera y en el suelo
- [ ] Temperatura del agua: 37-38°C (prueba con el codo)
- [ ] Medicamentos en armario alto con seguro

## Prevención por tipo de accidente

### Caídas (más común entre 6-12 meses)
- Nunca dejes al bebé en superficie elevada sin supervisión
- Instala portones en las escaleras antes de que el bebé gatee

### Atragantamiento
Alimentos de riesgo: uva entera, cereza, maní entero, zanahoria cruda, manzana cruda en trozos grandes.
- Corta siempre en trozos pequeños
- Aprende la maniobra de Heimlich para bebés

### Intoxicación
- Los medicamentos son la principal causa
- Guarda TODO en un lugar alto y con seguro
- **Centro de Control de Intoxicaciones:** consulta el número de tu país

---
**Fuente:** OMS y American Academy of Pediatrics (AAP).`,
  },
  {
    slug: "saltos-desarrollo-bebe",
    title: "Saltos de Desarrollo del Bebé: Qué Esperar Mes a Mes",
    excerpt: "Entiende los hitos del desarrollo, las semanas maravilla y cómo apoyar a tu bebé en cada salto.",
    readTime: "9 min de lectura",
    metaTitle: "Saltos de Desarrollo del Bebé: Guía Mes a Mes | Wilbor",
    metaDescription: "Guía completa de hitos del desarrollo del bebé y semanas maravilla. Qué esperar de 1 a 12 meses.",
    keywords: ["saltos de desarrollo bebé", "semanas maravilla", "hitos bebé", "desarrollo infantil", "crisis de crecimiento bebé"],
    content: `## ¿Qué son los saltos de desarrollo?

Los **saltos de desarrollo** (también llamados crisis de crecimiento o semanas maravilla) son períodos en los que el bebé pasa por cambios neurológicos intensos. Durante estos períodos, es común:
- Llanto excesivo e irritabilidad
- Regresión del sueño
- Mayor demanda de brazos y atención
- Rechazo temporal de la alimentación

## Hitos del desarrollo por mes

### 1 mes
- Enfoca la mirada en rostros (especialmente a 20-30cm)
- Reacciona a sonidos fuertes
- Movimientos reflejos (succión, prensión)

### 2 meses
- **Primera sonrisa social** (¡no son gases!)
- Comienza a vocalizar ("ah", "oh")
- Sigue objetos con los ojos

### 3 meses
- Sostiene la cabeza por más tiempo
- Sonríe en respuesta a la sonrisa del adulto

### 4 meses
- **Regresión del sueño** (hito neurológico importante)
- Ríe en voz alta
- Intenta alcanzar objetos

### 6 meses
- Se sienta con apoyo
- Transfiere objetos de una mano a la otra
- Reconoce su propio nombre

### 9-10 meses
- Se pone de pie con apoyo
- Pinza (agarra objetos pequeños con pulgar e índice)
- Entiende "no" y "adiós"

### 11-12 meses
- Primeros pasos (puede variar de 9 a 18 meses — normal)
- Primeras palabras ("mamá", "papá")
- Señala lo que quiere

## Cuándo consultar al pediatra

Habla con el pediatra si el bebé **no** muestra hasta:
- 3 meses: no sonríe socialmente
- 6 meses: no se sienta con apoyo, no vocaliza
- 12 meses: no señala, no dice ninguna palabra

---
**Fuente:** OMS, AAP e investigaciones sobre desarrollo infantil.`,
  },
  {
    slug: "bano-recien-nacido",
    title: "Baño del Recién Nacido: Guía Segura Paso a Paso",
    excerpt: "Cuándo dar el primer baño, temperatura correcta del agua, cuidado del cordón umbilical y consejos para la piel del recién nacido.",
    readTime: "6 min de lectura",
    metaTitle: "Baño del Recién Nacido: Guía Segura | Wilbor",
    metaDescription: "Guía completa del baño del recién nacido. Cuándo empezar, temperatura correcta, cuidado del cordón umbilical y seguridad.",
    keywords: ["baño recién nacido", "primer baño bebé", "cómo bañar recién nacido", "cuidado cordón umbilical", "piel recién nacido"],
    content: `## El primer baño: cuándo y cómo

La **OMS y la AAP** recomiendan esperar al menos **24 horas** después del nacimiento para el primer baño. Esto preserva el vérnix caseoso y evita la hipotermia.

## Frecuencia del baño

- **Recién nacido (0-4 semanas):** 2-3 veces por semana es suficiente
- **A partir de 1 mes:** puede ser diario si la familia lo prefiere
- **Higiene diaria esencial:** limpiar cara, cuello, axilas y zona del pañal

## Preparación antes del baño

### Materiales necesarios
- Bañera para bebé (o palangana)
- Termómetro de agua (o codo para probar)
- Toalla suave y caliente
- Jabón y champú neutros (pH 5,5, sin fragancia)
- Pañal y ropa limpia listos

### Temperatura ideal
- **Agua:** 37-38°C (tibia, no caliente — prueba con el codo)
- **Ambiente:** 24-26°C (cierra ventanas, sin corriente de aire)

## Paso a paso del baño

1. **Prepara todo** antes de coger al bebé
2. Desviste al bebé y envuélvelo en la toalla
3. Lava la **cara primero** con algodón húmedo (sin jabón)
4. Lava el **cabello** con el bebé aún en la toalla
5. Coloca al bebé en la bañera con **una mano siempre apoyando la cabeza**
6. Lava del **cuello hacia abajo**, dejando la zona genital para el final
7. **Retira rápidamente** y envuelve en la toalla caliente
8. Seca bien todos los pliegues (cuello, axilas, ingle, dedos)

## Cuidados especiales

### Cordón umbilical
- Mantén seco y expuesto al aire
- No cubras con el pañal
- Cae naturalmente en 7-21 días
- Señal de alarma: enrojecimiento, secreción con mal olor, sangrado

### Piel del recién nacido
- La **descamación** en los primeros días es normal
- El **eritema tóxico** (manchas rojas con centro blanco) es normal
- No uses talco (riesgo de inhalación)

## Seguridad en el baño

- **Nunca dejes al bebé solo**, ni un segundo
- Vacía la bañera inmediatamente después del baño
- Sujeta siempre con firmeza — los bebés mojados resbalan

---
**Fuente:** OMS y American Academy of Pediatrics (AAP).`,
  },
];
