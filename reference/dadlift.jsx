import { useState, useEffect, useCallback, useRef } from "react";

// ============================================================
// WORKOUT LIBRARY DATA
// ============================================================
const WORKOUTS = [
  { id: 'se-bw-1', name: 'The Backyard Basics', type: 'strength-endurance', equipment: 'bodyweight', description: 'No equipment, no excuses. Just you and gravity. A great place to start.', warmup: 'Start with 3-5 minutes of light movement to get your blood flowing — a brisk walk, jog in place, or jumping jacks. Then do 10 arm circles (forward and backward), 10 bodyweight squats, and 10 leg swings per side. The goal is to feel warm and loose, not tired.', modifications: 'If any exercise is too hard, reduce the range of motion (don\'t go as deep/far) or slow down. Push-ups can be done on your knees. Squats can be done to a chair (sit down and stand up). Rows can be done more upright. There\'s no shame in modifying — the goal is to move safely and build up over time.', exercises: [
    { id: 'e1', name: 'Push-Ups', category: 'push', sets: 3, notes: 'Lower your chest to the floor, then push back up. If this is too hard, start with your knees on the ground — that\'s totally fine. Go until you can\'t do another one with good form.', videoUrl: 'https://www.youtube.com/results?search_query=push+up+proper+form+beginner' },
    { id: 'e2', name: 'Inverted Rows (table or sturdy bar)', category: 'pull', sets: 3, notes: 'Lie on your back under a sturdy table. Grab the edge and pull your chest up to it, then lower back down. The more horizontal your body, the harder it is. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=inverted+row+at+home+beginner' },
    { id: 'e3', name: 'Bodyweight Squats', category: 'legs', sets: 3, notes: 'Stand with feet shoulder-width apart. Bend your knees and lower your hips like you\'re sitting into a chair until your thighs are parallel to the floor, then stand back up. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=bodyweight+squat+form+beginner' },
    { id: 'e4', name: 'Dead Bug', category: 'core', sets: 3, notes: 'Lie on your back, arms pointing at the ceiling, knees bent at 90 degrees. Slowly lower your right arm behind your head and your left leg toward the floor at the same time. Return and switch sides. Keep your lower back pressed into the floor the entire time — that\'s what makes it work. Go until you can\'t maintain good form.', videoUrl: 'https://www.youtube.com/results?search_query=dead+bug+exercise+beginner' },
  ]},
  { id: 'se-bw-2', name: 'Playground Dad', type: 'strength-endurance', equipment: 'bodyweight', description: 'Take the kids to the park. Use the park right back.', warmup: 'Start with 3-5 minutes of light movement to get your blood flowing — a brisk walk, jog in place, or jumping jacks. Then do 10 arm circles (forward and backward), 10 bodyweight squats, and 10 leg swings per side. The goal is to feel warm and loose, not tired.', modifications: 'If any exercise is too hard, reduce the range of motion (don\'t go as deep/far) or slow down. Push-ups can be done on your knees. Squats can be done to a chair (sit down and stand up). Rows can be done more upright. There\'s no shame in modifying — the goal is to move safely and build up over time.', exercises: [
    { id: 'e1', name: 'Decline Push-Ups (feet on bench)', category: 'push', sets: 3, notes: 'Put your feet up on a park bench, hands on the ground, and do push-ups. This makes your chest and shoulders work harder than regular push-ups. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=decline+push+ups+form+beginner' },
    { id: 'e2', name: 'Australian Pull-Ups (low bar)', category: 'pull', sets: 3, notes: 'Find a low bar at the playground (waist height is ideal). Hang underneath it with your feet on the ground, body straight, and pull your chest up to the bar. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=australian+pull+ups+beginner' },
    { id: 'e3', name: 'Walking Lunges', category: 'legs', sets: 3, notes: 'Take a big step forward and lower your back knee until it almost touches the ground, then step the other foot forward and repeat. Keep your chest tall. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=walking+lunge+form+beginner' },
    { id: 'e4', name: 'Plank Hold', category: 'core', sets: 3, notes: 'Get into a push-up position but rest on your forearms instead of your hands. Keep your body in a perfectly straight line from head to heels — don\'t let your hips sag or pike up. Hold as long as you can and count the seconds. That\'s your score to beat next time.', videoUrl: 'https://www.youtube.com/results?search_query=plank+hold+proper+form+beginner' },
  ]},
  { id: 'se-bw-3', name: 'The Wake-Up Call', type: 'strength-endurance', equipment: 'bodyweight', description: 'The one that makes you wonder why you started. Then glad you did.', warmup: 'Start with 3-5 minutes of light movement to get your blood flowing — a brisk walk, jog in place, or jumping jacks. Then do 10 arm circles (forward and backward), 10 bodyweight squats, and 10 leg swings per side. The goal is to feel warm and loose, not tired.', modifications: 'If any exercise is too hard, reduce the range of motion (don\'t go as deep/far) or slow down. Push-ups can be done on your knees. Squats can be done to a chair (sit down and stand up). Rows can be done more upright. There\'s no shame in modifying — the goal is to move safely and build up over time.', exercises: [
    { id: 'e1', name: 'Diamond Push-Ups', category: 'push', sets: 3, notes: 'Make a diamond shape with your hands under your chest and do push-ups. This targets your triceps (back of your arms) more than regular push-ups. If too hard, widen your hands a bit. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=diamond+push+ups+form+beginner' },
    { id: 'e2', name: 'Superman Holds', category: 'pull', sets: 3, notes: 'Lie face down on the floor. Lift your arms and legs off the ground at the same time, squeezing your back muscles. Hold as long as you can (count seconds), then rest. That\'s one set.', videoUrl: 'https://www.youtube.com/results?search_query=superman+hold+exercise+beginner' },
    { id: 'e3', name: 'Jump Squats', category: 'legs', sets: 3, notes: 'Do a regular squat, but when you stand up, jump off the ground. Land softly with bent knees. If jumping is too much on your knees, just do fast regular squats. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=jump+squat+form+beginner' },
    { id: 'e4', name: 'Bird Dog', category: 'core', sets: 3, notes: 'Start on your hands and knees. Extend your right arm forward and left leg back at the same time, keeping your back flat like a table. Hold for 2 seconds, return, switch sides. This trains your core to stabilize while your limbs move — exactly what you need in real life.', videoUrl: 'https://www.youtube.com/results?search_query=bird+dog+exercise+beginner' },
  ]},
  { id: 'se-diy-1', name: 'Sandbag Saturday', type: 'strength-endurance', equipment: 'household', description: 'Grab that bag of rocks or sand. Nature\'s free weights.', warmup: 'Start with 3-5 minutes of light movement to get your blood flowing — a brisk walk, jog in place, or jumping jacks. Then do 10 arm circles (forward and backward), 10 bodyweight squats, and 10 leg swings per side. The goal is to feel warm and loose, not tired.', modifications: 'If any exercise is too hard, reduce the range of motion (don\'t go as deep/far) or slow down. Push-ups can be done on your knees. Squats can be done to a chair (sit down and stand up). Rows can be done more upright. There\'s no shame in modifying — the goal is to move safely and build up over time.', exercises: [
    { id: 'e1', name: 'Sandbag Floor Press', category: 'push', sets: 3, notes: 'Lie on your back on the floor, hold the sandbag on your chest, and press it straight up until your arms are extended. Lower it back to your chest. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=sandbag+floor+press' },
    { id: 'e2', name: 'Sandbag Bent-Over Row', category: 'pull', sets: 3, notes: 'Stand with feet shoulder-width apart, bend forward at the hips (flat back), and pull the sandbag from the floor up to your belly button. Squeeze your shoulder blades together at the top. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=sandbag+bent+over+row' },
    { id: 'e3', name: 'Sandbag Goblet Squats', category: 'legs', sets: 3, notes: 'Hug the sandbag to your chest like you\'re holding a big goblet. Squat down keeping your chest tall, then stand back up. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=goblet+squat+form+beginner' },
    { id: 'e4', name: 'Sandbag Russian Twist', category: 'core', sets: 3, notes: 'Sit on the floor with knees bent, holding the sandbag at your chest. Lean back slightly so you feel your abs engage. Rotate your torso to touch the bag to the floor on your left, then your right. That\'s one rep. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=russian+twist+exercise+beginner' },
  ]},
  { id: 'se-diy-2', name: 'Toddler Tornado', type: 'strength-endurance', equipment: 'household', description: 'Equipment: one willing (or unwilling) child. Ages 2-6 recommended.', warmup: 'Start with 3-5 minutes of light movement to get your blood flowing — a brisk walk, jog in place, or jumping jacks. Then do 10 arm circles (forward and backward), 10 bodyweight squats, and 10 leg swings per side. The goal is to feel warm and loose, not tired.', modifications: 'If any exercise is too hard, reduce the range of motion (don\'t go as deep/far) or slow down. Push-ups can be done on your knees. Squats can be done to a chair (sit down and stand up). Rows can be done more upright. There\'s no shame in modifying — the goal is to move safely and build up over time.', exercises: [
    { id: 'e1', name: 'Kid Overhead Press', category: 'push', sets: 3, notes: 'Hold your kid at chest height and press them straight up overhead, then bring them back down. They\'ll love it. You\'ll feel it in your shoulders. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=overhead+press+form+beginner' },
    { id: 'e2', name: 'Kid-on-Back Rows', category: 'pull', sets: 3, notes: 'Get into a push-up position with your kid sitting on your back. With one hand, grab a jug of water or heavy bag and row it up to your hip. Switch arms each set. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=renegade+row+form+beginner' },
    { id: 'e3', name: 'Kid Squat & Toss', category: 'legs', sets: 3, notes: 'Hold your kid at your chest, squat down, stand up, and give them a gentle toss in the air. Giggles are your bonus reps. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=goblet+squat+form+beginner' },
    { id: 'e4', name: 'Sandbag Sit-Up', category: 'core', sets: 3, notes: 'Lie on your back holding the sandbag on your chest. Do a sit-up, keeping the bag pressed to your chest the whole time. The extra weight makes your abs work much harder. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=weighted+sit+up+beginner' },
  ]},
  { id: 'se-kb-1', name: 'Dust Off the Bell', type: 'strength-endurance', equipment: 'kettlebell', description: 'That kettlebell from 2020 is calling. Time to answer.', warmup: 'Start with 3-5 minutes of light movement to get your blood flowing — a brisk walk, jog in place, or jumping jacks. Then do 10 arm circles (forward and backward), 10 bodyweight squats, and 10 leg swings per side. The goal is to feel warm and loose, not tired.', modifications: 'If any exercise is too hard, reduce the range of motion (don\'t go as deep/far) or slow down. Push-ups can be done on your knees. Squats can be done to a chair (sit down and stand up). Rows can be done more upright. There\'s no shame in modifying — the goal is to move safely and build up over time.', exercises: [
    { id: 'e1', name: 'Kettlebell Push Press', category: 'push', sets: 3, notes: 'Hold the kettlebell at your shoulder. Dip your knees slightly, then use that momentum to press the bell overhead. Do one arm at a time. Go until you can\'t do another one, then switch arms.', videoUrl: 'https://www.youtube.com/results?search_query=kettlebell+push+press+form+beginner' },
    { id: 'e2', name: 'Kettlebell Single-Arm Row', category: 'pull', sets: 3, notes: 'Put one hand on a chair or bench for support, hold the kettlebell in the other hand, and pull it up to your hip. Keep your back flat. Go until you can\'t do another one, then switch arms.', videoUrl: 'https://www.youtube.com/results?search_query=kettlebell+single+arm+row+beginner' },
    { id: 'e3', name: 'Kettlebell Goblet Squats', category: 'legs', sets: 3, notes: 'Hold the kettlebell by the handle (horns) at your chest. Squat down, letting your elbows touch the inside of your knees at the bottom. Stand back up. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=kettlebell+goblet+squat+beginner' },
    { id: 'e4', name: 'KB Turkish Get-Up (half)', category: 'core', sets: 3, notes: 'Lie on your back holding a kettlebell straight up with one arm. Keeping the bell pointed at the ceiling, sit up onto your opposite elbow, then your hand, then lift your hips. That\'s half a get-up. Reverse the steps back down. Do 3-5 per arm. This is the single best core stability exercise there is.', videoUrl: 'https://www.youtube.com/results?search_query=half+turkish+get+up+beginner' },
  ]},
  { id: 'se-kb-2', name: 'Bell Ringer', type: 'strength-endurance', equipment: 'kettlebell', description: 'Swings, presses, and controlled effort.', warmup: 'Start with 3-5 minutes of light movement to get your blood flowing — a brisk walk, jog in place, or jumping jacks. Then do 10 arm circles (forward and backward), 10 bodyweight squats, and 10 leg swings per side. The goal is to feel warm and loose, not tired.', modifications: 'If any exercise is too hard, reduce the range of motion (don\'t go as deep/far) or slow down. Push-ups can be done on your knees. Squats can be done to a chair (sit down and stand up). Rows can be done more upright. There\'s no shame in modifying — the goal is to move safely and build up over time.', exercises: [
    { id: 'e1', name: 'Kettlebell Floor Press', category: 'push', sets: 3, notes: 'Lie on your back, hold the kettlebell in one hand at your shoulder, and press it straight up. Lower back down with control. Do one arm at a time. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=kettlebell+floor+press+beginner' },
    { id: 'e2', name: 'Kettlebell High Pull', category: 'pull', sets: 3, notes: 'Start with the kettlebell between your legs. Swing it up by driving your hips forward, pulling the bell to shoulder height with your elbow high. Control it back down. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=kettlebell+high+pull+form+beginner' },
    { id: 'e3', name: 'Kettlebell Reverse Lunges', category: 'legs', sets: 3, notes: 'Hold the kettlebell at your chest. Step one foot backward and lower your back knee toward the floor, then push off your back foot to stand back up. Alternate legs. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=kettlebell+reverse+lunge+beginner' },
    { id: 'e4', name: 'KB Windmill', category: 'core', sets: 3, notes: 'Hold a kettlebell overhead with one arm, locked out. Your feet are wider than shoulders, toes pointed slightly away from the bell. Slowly hinge at the hip and reach your free hand down toward your ankle. Keep your eyes on the bell. This stretches and strengthens your obliques. Do 5-8 per side.', videoUrl: 'https://www.youtube.com/results?search_query=kettlebell+windmill+beginner' },
  ]},
  { id: 'se-db-1', name: 'Dumbbell Dad Circuit', type: 'strength-endurance', equipment: 'dumbbell', description: 'Grab two dumbbells. That\'s all you need.', warmup: 'Start with 3-5 minutes of light movement to get your blood flowing — a brisk walk, jog in place, or jumping jacks. Then do 10 arm circles (forward and backward), 10 bodyweight squats, and 10 leg swings per side. The goal is to feel warm and loose, not tired.', modifications: 'If any exercise is too hard, reduce the range of motion (don\'t go as deep/far) or slow down. Push-ups can be done on your knees. Squats can be done to a chair (sit down and stand up). Rows can be done more upright. There\'s no shame in modifying — the goal is to move safely and build up over time.', exercises: [
    { id: 'e1', name: 'Dumbbell Push-Up to Row', category: 'push', sets: 3, notes: 'Place dumbbells on the floor, grip them, and do a push-up. At the top, row one dumbbell up to your hip, set it down, then row the other. That\'s one rep. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=push+up+to+row+dumbbell+beginner' },
    { id: 'e2', name: 'Dumbbell Bent-Over Row', category: 'pull', sets: 3, notes: 'Hold a dumbbell in each hand. Bend forward at the hips (flat back, slight knee bend). Pull both dumbbells up to your hips, squeezing your shoulder blades together. Lower and repeat. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=dumbbell+bent+over+row+form+beginner' },
    { id: 'e3', name: 'Dumbbell Step-Ups', category: 'legs', sets: 3, notes: 'Hold dumbbells at your sides. Step one foot up onto a sturdy chair, bench, or step, driving through that leg to stand up on top. Step back down. Alternate legs. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=dumbbell+step+ups+form+beginner' },
    { id: 'e4', name: 'Dumbbell Farmer\'s Carry', category: 'core', sets: 3, notes: 'Hold a heavy dumbbell in each hand at your sides. Walk slowly for 30-40 yards (or 30 seconds) with perfect posture — chest up, shoulders back, core tight. This looks easy but your entire core is working to keep you upright and stable. That\'s one set.', videoUrl: 'https://www.youtube.com/results?search_query=farmers+carry+exercise+beginner' },
  ]},
  { id: 'se-gym-1', name: 'Gym Made Simple', type: 'strength-endurance', equipment: 'full-gym', description: 'You have access to everything. Keep it simple anyway.', warmup: 'Start with 3-5 minutes of light movement to get your blood flowing — a brisk walk, jog in place, or jumping jacks. Then do 10 arm circles (forward and backward), 10 bodyweight squats, and 10 leg swings per side. The goal is to feel warm and loose, not tired.', modifications: 'If any exercise is too hard, reduce the range of motion (don\'t go as deep/far) or slow down. Push-ups can be done on your knees. Squats can be done to a chair (sit down and stand up). Rows can be done more upright. There\'s no shame in modifying — the goal is to move safely and build up over time.', exercises: [
    { id: 'e1', name: 'Cable Chest Flyes', category: 'push', sets: 3, notes: 'Stand between the cable machines, grab a handle in each hand, and bring your hands together in front of your chest in a hugging motion. Use light weight and feel the squeeze. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=cable+chest+fly+form+beginner' },
    { id: 'e2', name: 'Lat Pulldown', category: 'pull', sets: 3, notes: 'Sit at the lat pulldown machine. Grab the bar wide, pull it down to your upper chest, then slowly let it back up. Think about pulling with your back, not your arms. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=lat+pulldown+proper+form+beginner' },
    { id: 'e3', name: 'Leg Press', category: 'legs', sets: 3, notes: 'Sit in the leg press machine, feet shoulder-width on the platform. Push the weight up by extending your legs, then slowly lower it back. Don\'t lock your knees at the top. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=leg+press+form+beginner' },
    { id: 'e4', name: 'Cable Pallof Press', category: 'core', sets: 3, notes: 'Stand sideways to a cable machine with the handle at chest height. Hold it at your chest with both hands, then press it straight out in front of you. The cable is trying to twist you — resist it. Hold for 2 seconds, return. Do 8-10 per side. One of the best core exercises that most people have never tried.', videoUrl: 'https://www.youtube.com/results?search_query=pallof+press+beginner' },
  ]},
  { id: 'se-gym-2', name: 'The Sled Dog', type: 'strength-endurance', equipment: 'full-gym', description: 'Push it. Pull it. Build serious work capacity.', warmup: 'Start with 3-5 minutes of light movement to get your blood flowing — a brisk walk, jog in place, or jumping jacks. Then do 10 arm circles (forward and backward), 10 bodyweight squats, and 10 leg swings per side. The goal is to feel warm and loose, not tired.', modifications: 'If any exercise is too hard, reduce the range of motion (don\'t go as deep/far) or slow down. Push-ups can be done on your knees. Squats can be done to a chair (sit down and stand up). Rows can be done more upright. There\'s no shame in modifying — the goal is to move safely and build up over time.', exercises: [
    { id: 'e1', name: 'Sled Push', category: 'push', sets: 3, notes: 'Load a sled with moderate weight. Grab the low handles, lean in, and push it across the floor by driving with your legs. Push for 30-40 yards or 30 seconds. That\'s one set. Rest 60-90 seconds between sets.', videoUrl: 'https://www.youtube.com/results?search_query=sled+push+form+beginner' },
    { id: 'e2', name: 'Sled Pull (rope)', category: 'pull', sets: 3, notes: 'Attach a rope to the sled. Face it, sit your hips back, and pull the sled toward you hand-over-hand. When it reaches you, push it back and repeat. One trip = one set.', videoUrl: 'https://www.youtube.com/results?search_query=sled+rope+pull+beginner' },
    { id: 'e3', name: 'Landmine Squat', category: 'legs', sets: 3, notes: 'Put one end of a barbell in the landmine holder (the pivot on the floor). Hold the other end at your chest. Squat down and stand back up. The bar path guides your form. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=landmine+squat+form+beginner' },
    { id: 'e4', name: 'Hanging Knee Raise', category: 'core', sets: 3, notes: 'Hang from a pull-up bar. Slowly raise your knees toward your chest, pause, then lower with control. Don\'t swing — if you need to, bend your knees less or do the motion slower. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=hanging+knee+raise+beginner' },
  ]},
  { id: 'sh-bw-1', name: 'Slow & Steady', type: 'strength-hypertrophy', equipment: 'bodyweight', description: 'No weights? Go slow. The slower you move, the harder your muscles work.', warmup: 'Start with 5 minutes of easy cardio — walk, jog, bike, jump rope, whatever gets your heart rate up slightly. Then do 1 warm-up set of each exercise at very light weight (or bodyweight) for 10-12 reps. This primes the muscles and joints for heavier work and reduces injury risk.', modifications: 'If an exercise is too difficult, reduce the weight first. If a movement hurts your joints, try a different grip or angle. Replace any exercise that causes pain (not muscle burn — actual joint pain). Dumbbell versions are usually easier on joints than barbell versions. If you\'re unsure about form, watch the linked video before starting.', exercises: [
    { id: 'e1', name: 'Tempo Push-Ups (3 sec down)', category: 'push', sets: 4, notes: 'Do a push-up, but take 3 full seconds to lower yourself, then 1 second to push up. Count in your head. This makes your muscles work much harder than fast push-ups. Record how many you get each set.', videoUrl: 'https://www.youtube.com/results?search_query=tempo+push+ups+beginner' },
    { id: 'e2', name: 'Tempo Inverted Rows (3 sec up)', category: 'pull', sets: 4, notes: 'Under a table or bar, pull yourself up for 3 seconds, hold at the top for 1 second, then lower for 3 seconds. The slowness is the point — it forces your muscles to grow. Record how many you get each set.', videoUrl: 'https://www.youtube.com/results?search_query=tempo+inverted+rows' },
    { id: 'e3', name: 'Pistol Squat Progressions', category: 'legs', sets: 4, notes: 'Stand on one leg and try to squat down on just that leg. Hold onto a chair or doorframe for balance if needed. Even partial depth counts — track how deep you can go. The goal is to get lower over time.', videoUrl: 'https://www.youtube.com/results?search_query=pistol+squat+progression+beginner' },
    { id: 'e4', name: 'Mountain Climbers (slow)', category: 'core', sets: 4, notes: 'Get into a push-up position. Bring one knee toward your chest, return it, then bring the other knee. Go slowly and deliberately — this isn\'t cardio, it\'s core work. Keep your hips level and your back flat. Go until you can\'t maintain form.', videoUrl: 'https://www.youtube.com/results?search_query=slow+mountain+climbers+core+beginner' },
  ]},
  { id: 'sh-diy-1', name: 'Garage Gains', type: 'strength-hypertrophy', equipment: 'household', description: 'Your garage has more gym equipment than you think. Make the sandbag heavier this time.', warmup: 'Start with 5 minutes of easy cardio — walk, jog, bike, jump rope, whatever gets your heart rate up slightly. Then do 1 warm-up set of each exercise at very light weight (or bodyweight) for 10-12 reps. This primes the muscles and joints for heavier work and reduces injury risk.', modifications: 'If an exercise is too difficult, reduce the weight first. If a movement hurts your joints, try a different grip or angle. Replace any exercise that causes pain (not muscle burn — actual joint pain). Dumbbell versions are usually easier on joints than barbell versions. If you\'re unsure about form, watch the linked video before starting.', exercises: [
    { id: 'e1', name: 'Heavy Sandbag Press', category: 'push', sets: 4, notes: 'Lift the sandbag to your shoulder, then press it overhead. Use a heavier bag than your endurance day. Aim for 6-10 reps — if you can easily do more than 10, add more rocks or sand next time.', videoUrl: 'https://www.youtube.com/results?search_query=sandbag+clean+and+press+beginner' },
    { id: 'e2', name: 'Heavy Sandbag Row', category: 'pull', sets: 4, notes: 'Same as endurance day but with a heavier bag. Bend at the hips, pull the bag to your belly. Aim for 6-10 reps. If it\'s easy, make the bag heavier.', videoUrl: 'https://www.youtube.com/results?search_query=sandbag+bent+over+row' },
    { id: 'e3', name: 'Sandbag Zercher Squats', category: 'legs', sets: 4, notes: 'Hold the sandbag in the crook of your elbows (like cradling a baby). Squat down and stand back up. It\'s uncomfortable — that means it\'s working. Aim for 6-10 reps.', videoUrl: 'https://www.youtube.com/results?search_query=zercher+squat+form+beginner' },
    { id: 'e4', name: 'Bucket Carry Plank', category: 'core', sets: 4, notes: 'Get into a plank position (forearms on ground). Reach one hand out and drag a bucket or heavy object from one side to the other, then switch arms. Your core has to fight the rotation — that\'s the whole point. Go until you can\'t maintain form.', videoUrl: 'https://www.youtube.com/results?search_query=plank+drag+exercise' },
  ]},
  { id: 'sh-kb-1', name: 'Heavy Bells', type: 'strength-hypertrophy', equipment: 'kettlebell', description: 'Time to go heavier. Fewer reps. More weight. This is how you build muscle.', warmup: 'Start with 5 minutes of easy cardio — walk, jog, bike, jump rope, whatever gets your heart rate up slightly. Then do 1 warm-up set of each exercise at very light weight (or bodyweight) for 10-12 reps. This primes the muscles and joints for heavier work and reduces injury risk.', modifications: 'If an exercise is too difficult, reduce the weight first. If a movement hurts your joints, try a different grip or angle. Replace any exercise that causes pain (not muscle burn — actual joint pain). Dumbbell versions are usually easier on joints than barbell versions. If you\'re unsure about form, watch the linked video before starting.', exercises: [
    { id: 'e1', name: 'Double KB Clean & Press', category: 'push', sets: 4, notes: 'Swing the kettlebell(s) up to your shoulder (the \'clean\'), then press overhead. If you have two, use both. If one, alternate arms. Aim for 6-10 reps. When you can hit 10 easily, go heavier.', videoUrl: 'https://www.youtube.com/results?search_query=kettlebell+clean+and+press+beginner' },
    { id: 'e2', name: 'KB Gorilla Row', category: 'pull', sets: 4, notes: 'Place two kettlebells on the floor. Stand over them with a wide stance, bend at the hips, and row one bell up while pushing down on the other for stability. Alternate. Aim for 6-10 reps per arm.', videoUrl: 'https://www.youtube.com/results?search_query=kettlebell+gorilla+row+beginner' },
    { id: 'e3', name: 'KB Front Squat', category: 'legs', sets: 4, notes: 'Hold the kettlebell(s) in the \'rack\' position — at your shoulders, elbows tucked in. Squat as deep as you can with a tall chest. Aim for 6-10 reps. Go heavier when 10 is easy.', videoUrl: 'https://www.youtube.com/results?search_query=kettlebell+front+squat+beginner' },
    { id: 'e4', name: 'KB Halo', category: 'core', sets: 4, notes: 'Hold the kettlebell upside-down by the horns at your chest. Circle it around your head slowly — right shoulder, behind your head, left shoulder, back to front. That\'s one rep. Reverse direction each set. This works your core and shoulder stability. Do 8-10 each direction.', videoUrl: 'https://www.youtube.com/results?search_query=kettlebell+halo+exercise+beginner' },
  ]},
  { id: 'sh-db-1', name: 'The Classic', type: 'strength-hypertrophy', equipment: 'dumbbell', description: 'Bread and butter dumbbell work. Simple. Effective. Just add weight over time.', warmup: 'Start with 5 minutes of easy cardio — walk, jog, bike, jump rope, whatever gets your heart rate up slightly. Then do 1 warm-up set of each exercise at very light weight (or bodyweight) for 10-12 reps. This primes the muscles and joints for heavier work and reduces injury risk.', modifications: 'If an exercise is too difficult, reduce the weight first. If a movement hurts your joints, try a different grip or angle. Replace any exercise that causes pain (not muscle burn — actual joint pain). Dumbbell versions are usually easier on joints than barbell versions. If you\'re unsure about form, watch the linked video before starting.', exercises: [
    { id: 'e1', name: 'Dumbbell Bench Press (floor)', category: 'push', sets: 4, notes: 'Lie on the floor (or a bench if you have one), hold a dumbbell in each hand at chest level, and press them straight up. Lower with control. Aim for 6-10 reps. When you can hit 10, increase the weight by 5 lbs next time.', videoUrl: 'https://www.youtube.com/results?search_query=dumbbell+bench+press+form+beginner' },
    { id: 'e2', name: 'Dumbbell Row', category: 'pull', sets: 4, notes: 'Put one knee and hand on a bench or chair for support. Hold a dumbbell in the other hand and pull it up to your hip, squeezing your back. Aim for 6-10 reps each arm. Go heavier when 10 is easy.', videoUrl: 'https://www.youtube.com/results?search_query=single+arm+dumbbell+row+form+beginner' },
    { id: 'e3', name: 'Dumbbell Bulgarian Split Squat', category: 'legs', sets: 4, notes: 'Stand in front of a bench or chair, place one foot behind you on it, and squat down on your front leg. Hold dumbbells at your sides. This will humble you — start light. Aim for 6-10 reps each leg.', videoUrl: 'https://www.youtube.com/results?search_query=bulgarian+split+squat+dumbbell+beginner' },
    { id: 'e4', name: 'Dumbbell Woodchop', category: 'core', sets: 4, notes: 'Hold one dumbbell with both hands. Start with it by your right hip, then sweep it diagonally up and across your body to above your left shoulder. Reverse the path. This trains the rotational power your core is designed for. Do 8-10 per side.', videoUrl: 'https://www.youtube.com/results?search_query=dumbbell+woodchop+exercise+beginner' },
  ]},
  { id: 'sh-db-2', name: 'Upper Body Builder', type: 'strength-hypertrophy', equipment: 'dumbbell', description: 'Heavy dumbbells. Controlled movements. Visible results.', warmup: 'Start with 5 minutes of easy cardio — walk, jog, bike, jump rope, whatever gets your heart rate up slightly. Then do 1 warm-up set of each exercise at very light weight (or bodyweight) for 10-12 reps. This primes the muscles and joints for heavier work and reduces injury risk.', modifications: 'If an exercise is too difficult, reduce the weight first. If a movement hurts your joints, try a different grip or angle. Replace any exercise that causes pain (not muscle burn — actual joint pain). Dumbbell versions are usually easier on joints than barbell versions. If you\'re unsure about form, watch the linked video before starting.', exercises: [
    { id: 'e1', name: 'Dumbbell Overhead Press', category: 'push', sets: 4, notes: 'Sit or stand, hold dumbbells at shoulder height, and press them straight overhead. Lower with control. Aim for 6-10 reps. Increase weight by 5 lbs when you can complete all 4 sets of 10.', videoUrl: 'https://www.youtube.com/results?search_query=dumbbell+overhead+press+form+beginner' },
    { id: 'e2', name: 'Dumbbell Reverse Fly', category: 'pull', sets: 4, notes: 'Bend forward at the hips, hold light dumbbells hanging below you, and raise your arms out to the sides like wings. Squeeze your upper back at the top. This builds the muscles that improve your posture. Aim for 8-12 reps.', videoUrl: 'https://www.youtube.com/results?search_query=dumbbell+reverse+fly+form+beginner' },
    { id: 'e3', name: 'Dumbbell Romanian Deadlift', category: 'legs', sets: 4, notes: 'Hold dumbbells in front of your thighs. With a slight bend in your knees, hinge forward at the hips and lower the dumbbells along your legs until you feel a stretch in the back of your thighs. Stand back up. Aim for 6-10 reps.', videoUrl: 'https://www.youtube.com/results?search_query=dumbbell+romanian+deadlift+form+beginner' },
    { id: 'e4', name: 'Dumbbell Suitcase Carry', category: 'core', sets: 4, notes: 'Hold a heavy dumbbell in ONE hand only, at your side. Walk 30-40 yards. Your core has to fight to keep you from leaning sideways — that\'s an anti-lateral flexion exercise, and it builds real functional core strength. Switch hands and walk back.', videoUrl: 'https://www.youtube.com/results?search_query=suitcase+carry+exercise+beginner' },
  ]},
  { id: 'sh-gym-1', name: 'Iron Therapy', type: 'strength-hypertrophy', equipment: 'full-gym', description: 'Barbells — the original strength-building tool. Simple, heavy, effective.', warmup: 'Start with 5 minutes of easy cardio — walk, jog, bike, jump rope, whatever gets your heart rate up slightly. Then do 1 warm-up set of each exercise at very light weight (or bodyweight) for 10-12 reps. This primes the muscles and joints for heavier work and reduces injury risk.', modifications: 'If an exercise is too difficult, reduce the weight first. If a movement hurts your joints, try a different grip or angle. Replace any exercise that causes pain (not muscle burn — actual joint pain). Dumbbell versions are usually easier on joints than barbell versions. If you\'re unsure about form, watch the linked video before starting.', exercises: [
    { id: 'e1', name: 'Barbell Bench Press', category: 'push', sets: 4, notes: 'Lie on the bench, grip the bar slightly wider than shoulder-width, lower it to your chest, and press it back up. Start light and learn the movement. Aim for 6-10 reps. Add 5 lbs when you can complete all 4 sets of 10.', videoUrl: 'https://www.youtube.com/results?search_query=barbell+bench+press+form+beginner' },
    { id: 'e2', name: 'Barbell Bent-Over Row', category: 'pull', sets: 4, notes: 'Stand with feet shoulder-width, bend at the hips holding the barbell, and pull it to your lower chest. Keep your back flat — imagine balancing a glass of water on it. Aim for 6-10 reps.', videoUrl: 'https://www.youtube.com/results?search_query=barbell+bent+over+row+form+beginner' },
    { id: 'e3', name: 'Barbell Back Squat', category: 'legs', sets: 4, notes: 'Rest the bar across your upper back (not your neck). Feet shoulder-width apart. Squat down until your thighs are at least parallel to the floor, then drive back up. Depth matters more than weight. Aim for 6-10 reps.', videoUrl: 'https://www.youtube.com/results?search_query=barbell+back+squat+form+beginner' },
    { id: 'e4', name: 'Ab Wheel Rollout (or barbell rollout)', category: 'core', sets: 4, notes: 'Kneel on the floor, grip an ab wheel or a loaded barbell. Roll it forward, extending your body, then pull it back using your abs. Only go as far as you can control — don\'t collapse. Start small and increase range over time. Do 6-10 reps.', videoUrl: 'https://www.youtube.com/results?search_query=ab+wheel+rollout+beginner' },
  ]},
  { id: 'sh-gym-2', name: 'Landmine & Barbell', type: 'strength-hypertrophy', equipment: 'full-gym', description: 'The landmine setup is one of the most underused tools in any gym. Time to change that.', warmup: 'Start with 5 minutes of easy cardio — walk, jog, bike, jump rope, whatever gets your heart rate up slightly. Then do 1 warm-up set of each exercise at very light weight (or bodyweight) for 10-12 reps. This primes the muscles and joints for heavier work and reduces injury risk.', modifications: 'If an exercise is too difficult, reduce the weight first. If a movement hurts your joints, try a different grip or angle. Replace any exercise that causes pain (not muscle burn — actual joint pain). Dumbbell versions are usually easier on joints than barbell versions. If you\'re unsure about form, watch the linked video before starting.', exercises: [
    { id: 'e1', name: 'Landmine Press', category: 'push', sets: 4, notes: 'Kneel on one knee next to the end of the barbell in the landmine. Hold the end of the bar at your shoulder and press it up and forward. Great for shoulders. Do one arm at a time. Aim for 6-10 reps per arm.', videoUrl: 'https://www.youtube.com/results?search_query=landmine+press+form+beginner' },
    { id: 'e2', name: 'Landmine Row', category: 'pull', sets: 4, notes: 'Stand straddling the barbell, facing away from the pivot. Bend at the hips and grab the end of the bar with both hands. Row it up to your chest and lower with control. Aim for 6-10 reps.', videoUrl: 'https://www.youtube.com/results?search_query=landmine+row+form+beginner' },
    { id: 'e3', name: 'Barbell Front Squat', category: 'legs', sets: 4, notes: 'Rest the barbell across the front of your shoulders, elbows pointing forward to create a shelf. Squat down keeping your chest tall and elbows high. This forces great form. Aim for 6-10 reps.', videoUrl: 'https://www.youtube.com/results?search_query=barbell+front+squat+form+beginner' },
    { id: 'e4', name: 'Cable Woodchop', category: 'core', sets: 4, notes: 'Set the cable high. Grab the handle with both hands and pull it diagonally down and across your body to your opposite hip, rotating your torso. Control it back up. This builds rotational core power. Do 8-10 per side.', videoUrl: 'https://www.youtube.com/results?search_query=cable+woodchop+exercise+beginner' },
  ]},
  { id: 'cl2-1', name: 'The Long Walk', type: 'cardio-l2', equipment: 'bodyweight', description: 'The simplest workout there is. Walk with purpose for 45-60 minutes.', warmup: 'Start the first 5 minutes of your session at an easy pace — slower than your target pace. Let your body warm up gradually. Do a few gentle stretches if anything feels tight, but don\'t force it. Your pace will naturally increase as your body warms up.', modifications: 'If walking doesn\'t get your heart rate up enough, walk faster, add hills, wear a weighted backpack, or switch to an easy jog or bike ride. If you have bad knees, cycling or swimming are great low-impact alternatives. If you can only do 20 minutes to start, that\'s fine — build up by adding 5 minutes each week.', exercises: [
    { id: 'e1', name: 'Brisk Walk or Easy Jog', category: 'cardio', sets: 1, notes: 'Walk or jog for 45-60 minutes at a pace where you could hold a conversation without gasping. That\'s the test — if you can\'t talk comfortably, slow down. If it feels too easy, walk faster, find a hill, or start jogging. Use trails if you\'ve got them.' },
  ]},
  { id: 'cl2-2', name: 'Trail Day', type: 'cardio-l2', equipment: 'bodyweight', description: 'Get outside. Take the long trail. Get your heart rate up while enjoying the scenery.', warmup: 'Start the first 5 minutes of your session at an easy pace — slower than your target pace. Let your body warm up gradually. Do a few gentle stretches if anything feels tight, but don\'t force it. Your pace will naturally increase as your body warms up.', modifications: 'If walking doesn\'t get your heart rate up enough, walk faster, add hills, wear a weighted backpack, or switch to an easy jog or bike ride. If you have bad knees, cycling or swimming are great low-impact alternatives. If you can only do 20 minutes to start, that\'s fine — build up by adding 5 minutes each week.', exercises: [
    { id: 'e1', name: 'Trail Run/Hike', category: 'cardio', sets: 1, notes: '45-90 minutes on trails. Keep a steady, sustainable pace — you should be able to talk throughout. Walk the steep hills if you need to, that\'s smart pacing, not weakness. The goal is continuous movement for the full time.' },
  ]},
  { id: 'cl2-3', name: 'Saddle Up', type: 'cardio-l2', equipment: 'bodyweight', description: 'Get on a bike — real or stationary — and just pedal for a while.', warmup: 'Start the first 5 minutes of your session at an easy pace — slower than your target pace. Let your body warm up gradually. Do a few gentle stretches if anything feels tight, but don\'t force it. Your pace will naturally increase as your body warms up.', modifications: 'If walking doesn\'t get your heart rate up enough, walk faster, add hills, wear a weighted backpack, or switch to an easy jog or bike ride. If you have bad knees, cycling or swimming are great low-impact alternatives. If you can only do 20 minutes to start, that\'s fine — build up by adding 5 minutes each week.', exercises: [
    { id: 'e1', name: 'Steady Cycling', category: 'cardio', sets: 1, notes: '45-60 minutes of cycling at moderate effort. You should feel like you could keep going for another hour. If a regular ride feels too easy, add hills, increase resistance, or ride farther. The \'conversation test\' still applies — if you can\'t talk, ease up.' },
  ]},
  { id: 'cl2-4', name: 'Neighborhood Patrol', type: 'cardio-l2', equipment: 'bodyweight', description: 'Walk the neighborhood like you own it. Wave to the neighbors.', warmup: 'Start the first 5 minutes of your session at an easy pace — slower than your target pace. Let your body warm up gradually. Do a few gentle stretches if anything feels tight, but don\'t force it. Your pace will naturally increase as your body warms up.', modifications: 'If walking doesn\'t get your heart rate up enough, walk faster, add hills, wear a weighted backpack, or switch to an easy jog or bike ride. If you have bad knees, cycling or swimming are great low-impact alternatives. If you can only do 20 minutes to start, that\'s fine — build up by adding 5 minutes each week.', exercises: [
    { id: 'e1', name: 'Power Walk', category: 'cardio', sets: 1, notes: '45-60 minutes of purposeful walking — arms swinging, good pace. If regular walking doesn\'t feel challenging enough, wear a backpack with some weight in it, choose a hilly route, or pick up the pace. You should feel warm and slightly winded but able to hold a conversation.' },
  ]},
  { id: 'cvo2-1', name: 'Hill Repeats', type: 'cardio-vo2max', equipment: 'bodyweight', description: 'Find a hill. Run up it. Walk down. Repeat. Simple and brutally effective.', warmup: 'This is the one workout where warming up is critical — don\'t skip it. Do 5 minutes of easy movement (walk, light jog, easy pedal). Then do 2-3 short pickups at about 70% effort for 10-15 seconds each. This preps your heart and muscles for the intense intervals ahead.', modifications: 'If the prescribed intervals are too intense, reduce the work time (20 seconds instead of 30) or increase the rest time (2 minutes instead of 90 seconds). If running hurts your joints, substitute cycling, rowing, or burpees. If you\'re brand new to high-intensity work, start with just 4-5 rounds instead of 8-10 and build up.', exercises: [
    { id: 'e1', name: 'Hill Sprints', category: 'cardio', sets: 1, notes: 'Find a steep hill that takes 30-60 seconds to sprint up. Run up as hard as you can, then walk back down to recover. That\'s one repeat. Do 6-12 repeats. When you get to the top, you should be breathing so hard that talking is impossible. If it\'s not that hard, go faster or find a steeper hill. Rest at the bottom until your breathing slows, then go again.' },
  ]},
  { id: 'cvo2-2', name: 'The Interval Mile', type: 'cardio-vo2max', equipment: 'bodyweight', description: 'Short sprints. Full recovery. Maximum effort. 20-25 minutes total.', warmup: 'This is the one workout where warming up is critical — don\'t skip it. Do 5 minutes of easy movement (walk, light jog, easy pedal). Then do 2-3 short pickups at about 70% effort for 10-15 seconds each. This preps your heart and muscles for the intense intervals ahead.', modifications: 'If the prescribed intervals are too intense, reduce the work time (20 seconds instead of 30) or increase the rest time (2 minutes instead of 90 seconds). If running hurts your joints, substitute cycling, rowing, or burpees. If you\'re brand new to high-intensity work, start with just 4-5 rounds instead of 8-10 and build up.', exercises: [
    { id: 'e1', name: 'Running Intervals', category: 'cardio', sets: 1, notes: 'After a 5-minute easy warmup: sprint as fast as you can for 30 seconds, then walk or jog very easy for 90 seconds. That\'s one round. Do 8-10 rounds. The sprints should feel like an 8-9 out of 10 effort — you should be out of breath and glad for the rest. If 30 seconds feels easy, sprint harder, not longer.' },
  ]},
  { id: 'cvo2-3', name: 'Burpee Blitz', type: 'cardio-vo2max', equipment: 'bodyweight', description: 'No running required. No equipment. Just burpees and willpower.', warmup: 'This is the one workout where warming up is critical — don\'t skip it. Do 5 minutes of easy movement (walk, light jog, easy pedal). Then do 2-3 short pickups at about 70% effort for 10-15 seconds each. This preps your heart and muscles for the intense intervals ahead.', modifications: 'If the prescribed intervals are too intense, reduce the work time (20 seconds instead of 30) or increase the rest time (2 minutes instead of 90 seconds). If running hurts your joints, substitute cycling, rowing, or burpees. If you\'re brand new to high-intensity work, start with just 4-5 rounds instead of 8-10 and build up.', exercises: [
    { id: 'e1', name: 'Burpee Intervals', category: 'cardio', sets: 1, notes: 'A burpee: squat down, place your hands on the floor, jump your feet back to a push-up position, lower your chest to the floor, push up, jump your feet forward, and jump up with hands overhead. That\'s one. Do 30 seconds of burpees, rest 30 seconds. Repeat for 10-15 rounds. If regular burpees are too hard, skip the push-up part — just squat, step back, step forward, stand up.' },
  ]},
  { id: 'cvo2-4', name: 'The Bike Sprint', type: 'cardio-vo2max', equipment: 'bodyweight', description: 'On a bike — real or stationary. Short, all-out efforts. Great if running is hard on your joints.', warmup: 'This is the one workout where warming up is critical — don\'t skip it. Do 5 minutes of easy movement (walk, light jog, easy pedal). Then do 2-3 short pickups at about 70% effort for 10-15 seconds each. This preps your heart and muscles for the intense intervals ahead.', modifications: 'If the prescribed intervals are too intense, reduce the work time (20 seconds instead of 30) or increase the rest time (2 minutes instead of 90 seconds). If running hurts your joints, substitute cycling, rowing, or burpees. If you\'re brand new to high-intensity work, start with just 4-5 rounds instead of 8-10 and build up.', exercises: [
    { id: 'e1', name: 'Cycling Intervals', category: 'cardio', sets: 1, notes: 'After a 5-minute easy warmup: pedal as absolutely hard as you can for 20 seconds, then pedal very easy for 40 seconds. That\'s one round. Do 8-12 rounds. Those 20 seconds should feel like you\'re being chased. If it doesn\'t feel intense enough, increase the resistance or gear.' },
  ]},
  { id: 'cvo2-5', name: 'Stair Climber', type: 'cardio-vo2max', equipment: 'bodyweight', description: 'Find stairs. Any stairs. Stadium bleachers, a parking ramp, your office stairwell.', warmup: 'This is the one workout where warming up is critical — don\'t skip it. Do 5 minutes of easy movement (walk, light jog, easy pedal). Then do 2-3 short pickups at about 70% effort for 10-15 seconds each. This preps your heart and muscles for the intense intervals ahead.', modifications: 'If the prescribed intervals are too intense, reduce the work time (20 seconds instead of 30) or increase the rest time (2 minutes instead of 90 seconds). If running hurts your joints, substitute cycling, rowing, or burpees. If you\'re brand new to high-intensity work, start with just 4-5 rounds instead of 8-10 and build up.', exercises: [
    { id: 'e1', name: 'Stair Sprints', category: 'cardio', sets: 1, notes: 'Sprint up the stairs as fast as you can, then walk back down. That\'s one repeat. Do 8-12 repeats. Like hill repeats, you should be gasping at the top. Walk down slowly to recover. When the stairs feel easy, skip steps (take two at a time) or carry something heavy.' },
  ]},
  { id: 'cvo2-6', name: 'Jump Rope Lightning', type: 'cardio-vo2max', equipment: 'bodyweight', description: 'A jump rope costs $10 and delivers world-class cardio. No excuses.', warmup: 'This is the one workout where warming up is critical — don\'t skip it. Do 5 minutes of easy movement (walk, light jog, easy pedal). Then do 2-3 short pickups at about 70% effort for 10-15 seconds each. This preps your heart and muscles for the intense intervals ahead.', modifications: 'If the prescribed intervals are too intense, reduce the work time (20 seconds instead of 30) or increase the rest time (2 minutes instead of 90 seconds). If running hurts your joints, substitute cycling, rowing, or burpees. If you\'re brand new to high-intensity work, start with just 4-5 rounds instead of 8-10 and build up.', exercises: [
    { id: 'e1', name: 'Jump Rope Intervals', category: 'cardio', sets: 1, notes: 'Jump rope as fast as you can for 30 seconds, rest 30 seconds. Do 10-15 rounds. If you trip up, just restart — tripping is normal. If you don\'t have a rope, do imaginary jump rope (same motion, no rope). The goal is to be breathing hard during the work intervals.' },
  ]},
  { id: 'cvo2-7', name: 'The Backyard Blitz', type: 'cardio-vo2max', equipment: 'bodyweight', description: 'No equipment, no gym, no distance needed. Just your backyard and effort.', warmup: 'This is the one workout where warming up is critical — don\'t skip it. Do 5 minutes of easy movement (walk, light jog, easy pedal). Then do 2-3 short pickups at about 70% effort for 10-15 seconds each. This preps your heart and muscles for the intense intervals ahead.', modifications: 'If the prescribed intervals are too intense, reduce the work time (20 seconds instead of 30) or increase the rest time (2 minutes instead of 90 seconds). If running hurts your joints, substitute cycling, rowing, or burpees. If you\'re brand new to high-intensity work, start with just 4-5 rounds instead of 8-10 and build up.', exercises: [
    { id: 'e1', name: 'Bodyweight HIIT Circuit', category: 'cardio', sets: 1, notes: 'Do each move for 30 seconds with 15 seconds rest between: high knees, squat jumps, mountain climbers, lateral shuffles. That\'s one round. Do 4-6 rounds with 60 seconds rest between rounds. You should be drenched by round 3.' },
  ]},
  { id: 'se-bw-4', name: 'The Early Riser', type: 'strength-endurance', equipment: 'bodyweight', description: 'Quick, effective, done before the kids wake up.', warmup: 'Start with 3-5 minutes of light movement to get your blood flowing — a brisk walk, jog in place, or jumping jacks. Then do 10 arm circles (forward and backward), 10 bodyweight squats, and 10 leg swings per side. The goal is to feel warm and loose, not tired.', modifications: 'If any exercise is too hard, reduce the range of motion (don\'t go as deep/far) or slow down. Push-ups can be done on your knees. Squats can be done to a chair (sit down and stand up). Rows can be done more upright. There\'s no shame in modifying — the goal is to move safely and build up over time.', exercises: [
    { id: 'e1', name: 'Pike Push-Ups', category: 'push', sets: 3, notes: 'Get into a push-up position but walk your feet toward your hands so your hips are high in the air (like an upside-down V). Now do push-ups in that position — this targets your shoulders. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=pike+push+ups+beginner' },
    { id: 'e2', name: 'Doorframe Rows', category: 'pull', sets: 3, notes: 'Stand facing the edge of an open door. Grab both sides of the door at chest height. Lean back with straight arms, then pull yourself to the door. The further back your feet, the harder it is. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=doorframe+rows+exercise' },
    { id: 'e3', name: 'Bulgarian Split Squat (bodyweight)', category: 'legs', sets: 3, notes: 'Stand in front of a couch or chair. Put one foot behind you on it. Squat down on your front leg until your back knee almost touches the ground. This is harder than it looks. Do one leg, then the other. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=bodyweight+bulgarian+split+squat+beginner' },
    { id: 'e4', name: 'Flutter Kicks', category: 'core', sets: 3, notes: 'Lie on your back, hands under your hips for support. Lift both legs a few inches off the floor and kick them up and down in small, alternating motions. Keep your lower back pressed into the floor. Go until you can\'t maintain form.', videoUrl: 'https://www.youtube.com/results?search_query=flutter+kicks+exercise+beginner' },
  ]},
  { id: 'se-bw-5', name: 'Park Bench Pro', type: 'strength-endurance', equipment: 'bodyweight', description: 'All you need is a park bench. Bring the kids.', warmup: 'Start with 3-5 minutes of light movement to get your blood flowing — a brisk walk, jog in place, or jumping jacks. Then do 10 arm circles (forward and backward), 10 bodyweight squats, and 10 leg swings per side. The goal is to feel warm and loose, not tired.', modifications: 'If any exercise is too hard, reduce the range of motion (don\'t go as deep/far) or slow down. Push-ups can be done on your knees. Squats can be done to a chair (sit down and stand up). Rows can be done more upright. There\'s no shame in modifying — the goal is to move safely and build up over time.', exercises: [
    { id: 'e1', name: 'Incline Push-Ups (hands on bench)', category: 'push', sets: 3, notes: 'Place your hands on the bench, feet on the ground, and do push-ups. This is easier than floor push-ups — a great starting point if regular push-ups are too hard. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=incline+push+ups+bench+beginner' },
    { id: 'e2', name: 'Bench Inverted Rows', category: 'pull', sets: 3, notes: 'Sit on the ground in front of the bench. Reach up, grab the edge, and pull your chest up toward it. Your feet stay on the ground, legs bent. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=inverted+row+park+bench' },
    { id: 'e3', name: 'Step-Ups (on bench)', category: 'legs', sets: 3, notes: 'Step one foot up onto the bench, drive through that leg to stand on top, then step back down. Alternate legs. Keep your chest tall. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=bench+step+ups+beginner' },
    { id: 'e4', name: 'Dead Bug', category: 'core', sets: 3, notes: 'Lie on your back, arms pointing at the ceiling, knees bent at 90 degrees. Slowly lower your right arm behind your head and your left leg toward the floor at the same time. Return and switch sides. Keep your lower back pressed into the floor the entire time — that\'s what makes it work. Go until you can\'t maintain good form.', videoUrl: 'https://www.youtube.com/results?search_query=dead+bug+exercise+beginner' },
  ]},
  { id: 'se-diy-3', name: 'Bucket Brigade', type: 'strength-endurance', equipment: 'household', description: 'Two 5-gallon buckets filled with whatever you\'ve got. Sand, gravel, water.', warmup: 'Start with 3-5 minutes of light movement to get your blood flowing — a brisk walk, jog in place, or jumping jacks. Then do 10 arm circles (forward and backward), 10 bodyweight squats, and 10 leg swings per side. The goal is to feel warm and loose, not tired.', modifications: 'If any exercise is too hard, reduce the range of motion (don\'t go as deep/far) or slow down. Push-ups can be done on your knees. Squats can be done to a chair (sit down and stand up). Rows can be done more upright. There\'s no shame in modifying — the goal is to move safely and build up over time.', exercises: [
    { id: 'e1', name: 'Bucket Floor Press', category: 'push', sets: 3, notes: 'Lie on the floor holding a bucket handle in each hand at chest level. Press them straight up, then lower. If buckets are awkward, use one bucket held with both hands. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=floor+press+form+beginner' },
    { id: 'e2', name: 'Bucket Rows', category: 'pull', sets: 3, notes: 'Bend forward at the hips, grab a bucket in each hand, and pull them up to your hips. Squeeze your shoulder blades together at the top. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=bent+over+row+form+beginner' },
    { id: 'e3', name: 'Bucket Farmer Carry Lunges', category: 'legs', sets: 3, notes: 'Hold a bucket in each hand at your sides. Do walking lunges across your yard. The buckets make it harder to balance, which is the point. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=farmer+carry+lunges+beginner' },
    { id: 'e4', name: 'Sandbag Russian Twist', category: 'core', sets: 3, notes: 'Sit on the floor with knees bent, holding the sandbag at your chest. Lean back slightly so you feel your abs engage. Rotate your torso to touch the bag to the floor on your left, then your right. That\'s one rep. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=russian+twist+exercise+beginner' },
  ]},
  { id: 'se-diy-4', name: 'The Furniture Workout', type: 'strength-endurance', equipment: 'household', description: 'Your house IS a gym. Chairs, towels, walls — everything works.', warmup: 'Start with 3-5 minutes of light movement to get your blood flowing — a brisk walk, jog in place, or jumping jacks. Then do 10 arm circles (forward and backward), 10 bodyweight squats, and 10 leg swings per side. The goal is to feel warm and loose, not tired.', modifications: 'If any exercise is too hard, reduce the range of motion (don\'t go as deep/far) or slow down. Push-ups can be done on your knees. Squats can be done to a chair (sit down and stand up). Rows can be done more upright. There\'s no shame in modifying — the goal is to move safely and build up over time.', exercises: [
    { id: 'e1', name: 'Chair Dips', category: 'push', sets: 3, notes: 'Sit on the edge of a sturdy chair. Place your hands on the edge, slide your butt off, and lower yourself by bending your elbows. Push back up. This works your triceps. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=chair+dips+beginner' },
    { id: 'e2', name: 'Towel Rows', category: 'pull', sets: 3, notes: 'Loop a towel around a sturdy post or door handle. Grab both ends, lean back, and pull yourself in. The towel makes your grip work harder too. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=towel+row+exercise' },
    { id: 'e3', name: 'Wall Sit', category: 'legs', sets: 3, notes: 'Stand with your back against a wall, slide down until your thighs are parallel to the floor (like sitting in an invisible chair). Hold as long as you can. Count seconds — that\'s your score to beat.', videoUrl: 'https://www.youtube.com/results?search_query=wall+sit+form' },
    { id: 'e4', name: 'Sandbag Sit-Up', category: 'core', sets: 3, notes: 'Lie on your back holding the sandbag on your chest. Do a sit-up, keeping the bag pressed to your chest the whole time. The extra weight makes your abs work much harder. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=weighted+sit+up+beginner' },
  ]},
  { id: 'se-kb-3', name: 'Swing Shift', type: 'strength-endurance', equipment: 'kettlebell', description: 'Built around the kettlebell swing — the single best bang-for-your-buck exercise.', warmup: 'Start with 3-5 minutes of light movement to get your blood flowing — a brisk walk, jog in place, or jumping jacks. Then do 10 arm circles (forward and backward), 10 bodyweight squats, and 10 leg swings per side. The goal is to feel warm and loose, not tired.', modifications: 'If any exercise is too hard, reduce the range of motion (don\'t go as deep/far) or slow down. Push-ups can be done on your knees. Squats can be done to a chair (sit down and stand up). Rows can be done more upright. There\'s no shame in modifying — the goal is to move safely and build up over time.', exercises: [
    { id: 'e1', name: 'Kettlebell Overhead Press', category: 'push', sets: 3, notes: 'Hold the kettlebell at your shoulder with one hand. Press it straight overhead until your arm is fully extended. Lower with control. Go until you can\'t do another one, then switch arms.', videoUrl: 'https://www.youtube.com/results?search_query=kettlebell+overhead+press+beginner' },
    { id: 'e2', name: 'Kettlebell Swing', category: 'pull', sets: 3, notes: 'Stand with feet wider than shoulder-width. Hold the bell with both hands. Hike it between your legs, then snap your hips forward to swing it to chest height. Your arms don\'t lift the bell — your hips do. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=kettlebell+swing+form+beginner' },
    { id: 'e3', name: 'Kettlebell Sumo Squat', category: 'legs', sets: 3, notes: 'Stand with feet wide and toes pointed slightly out. Hold the kettlebell hanging between your legs. Squat down until the bell nearly touches the floor, then stand. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=kettlebell+sumo+squat+beginner' },
    { id: 'e4', name: 'KB Turkish Get-Up (half)', category: 'core', sets: 3, notes: 'Lie on your back holding a kettlebell straight up with one arm. Keeping the bell pointed at the ceiling, sit up onto your opposite elbow, then your hand, then lift your hips. That\'s half a get-up. Reverse the steps back down. Do 3-5 per arm. This is the single best core stability exercise there is.', videoUrl: 'https://www.youtube.com/results?search_query=half+turkish+get+up+beginner' },
  ]},
  { id: 'se-db-2', name: 'The Quick Fifteen', type: 'strength-endurance', equipment: 'dumbbell', description: 'Light dumbbells, high reps, minimal rest. Done in 15-20 minutes.', warmup: 'Start with 3-5 minutes of light movement to get your blood flowing — a brisk walk, jog in place, or jumping jacks. Then do 10 arm circles (forward and backward), 10 bodyweight squats, and 10 leg swings per side. The goal is to feel warm and loose, not tired.', modifications: 'If any exercise is too hard, reduce the range of motion (don\'t go as deep/far) or slow down. Push-ups can be done on your knees. Squats can be done to a chair (sit down and stand up). Rows can be done more upright. There\'s no shame in modifying — the goal is to move safely and build up over time.', exercises: [
    { id: 'e1', name: 'Dumbbell Shoulder Press', category: 'push', sets: 3, notes: 'Hold dumbbells at shoulder height, palms facing forward. Press straight up overhead. Lower with control. Use light weight — this is about reps, not heavy lifting. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=dumbbell+shoulder+press+beginner' },
    { id: 'e2', name: 'Dumbbell Reverse Fly', category: 'pull', sets: 3, notes: 'Bend forward at the hips. Hold dumbbells hanging below you. Raise your arms out to the sides like you\'re spreading wings. Squeeze your upper back. Use light weight. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=dumbbell+reverse+fly+beginner' },
    { id: 'e3', name: 'Dumbbell Goblet Squat', category: 'legs', sets: 3, notes: 'Hold one dumbbell vertically at your chest with both hands, like a goblet. Squat down keeping your chest tall. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=dumbbell+goblet+squat+beginner' },
    { id: 'e4', name: 'Dumbbell Renegade Row Plank', category: 'core', sets: 3, notes: 'Get into a push-up position holding dumbbells. Without rowing, just hold the plank position for 30-60 seconds. The narrow, unstable base forces your core to work overtime. If you want more challenge, slowly row one dumbbell at a time.', videoUrl: 'https://www.youtube.com/results?search_query=renegade+row+plank+beginner' },
  ]},
  { id: 'se-db-3', name: 'Dumbbell Grinder', type: 'strength-endurance', equipment: 'dumbbell', description: 'Three classic moves. Light weight. Maximum reps. Full body burn.', warmup: 'Start with 3-5 minutes of light movement to get your blood flowing — a brisk walk, jog in place, or jumping jacks. Then do 10 arm circles (forward and backward), 10 bodyweight squats, and 10 leg swings per side. The goal is to feel warm and loose, not tired.', modifications: 'If any exercise is too hard, reduce the range of motion (don\'t go as deep/far) or slow down. Push-ups can be done on your knees. Squats can be done to a chair (sit down and stand up). Rows can be done more upright. There\'s no shame in modifying — the goal is to move safely and build up over time.', exercises: [
    { id: 'e1', name: 'Dumbbell Floor Fly', category: 'push', sets: 3, notes: 'Lie on the floor with a dumbbell in each hand, arms extended above your chest. Lower your arms out to the sides in a wide arc until your elbows touch the floor, then bring them back together. Like a hugging motion. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=dumbbell+floor+fly+beginner' },
    { id: 'e2', name: 'Dumbbell Upright Row', category: 'pull', sets: 3, notes: 'Hold dumbbells in front of your thighs. Pull them straight up along your body until your elbows are at shoulder height, then lower. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=dumbbell+upright+row+beginner' },
    { id: 'e3', name: 'Dumbbell Sumo Squat', category: 'legs', sets: 3, notes: 'Stand with feet wide and toes pointed out. Hold one dumbbell with both hands hanging between your legs. Squat down deep, then stand. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=dumbbell+sumo+squat+beginner' },
    { id: 'e4', name: 'Dumbbell Farmer\'s Carry', category: 'core', sets: 3, notes: 'Hold a heavy dumbbell in each hand at your sides. Walk slowly for 30-40 yards (or 30 seconds) with perfect posture — chest up, shoulders back, core tight. This looks easy but your entire core is working to keep you upright and stable. That\'s one set.', videoUrl: 'https://www.youtube.com/results?search_query=farmers+carry+exercise+beginner' },
  ]},
  { id: 'se-gym-3', name: 'Cable Cruiser', type: 'strength-endurance', equipment: 'full-gym', description: 'The cable machine does everything. Three moves, full body, smooth resistance.', warmup: 'Start with 3-5 minutes of light movement to get your blood flowing — a brisk walk, jog in place, or jumping jacks. Then do 10 arm circles (forward and backward), 10 bodyweight squats, and 10 leg swings per side. The goal is to feel warm and loose, not tired.', modifications: 'If any exercise is too hard, reduce the range of motion (don\'t go as deep/far) or slow down. Push-ups can be done on your knees. Squats can be done to a chair (sit down and stand up). Rows can be done more upright. There\'s no shame in modifying — the goal is to move safely and build up over time.', exercises: [
    { id: 'e1', name: 'Cable Press (low to high)', category: 'push', sets: 3, notes: 'Set the cable at the lowest position. Grab the handle with one hand and press it up and forward in a scooping motion. Great for upper chest. Go until you can\'t do another one, then switch arms.', videoUrl: 'https://www.youtube.com/results?search_query=low+to+high+cable+press+beginner' },
    { id: 'e2', name: 'Cable Face Pull', category: 'pull', sets: 3, notes: 'Set the cable at head height with a rope attachment. Grab the rope and pull it toward your face, spreading the ends apart. Squeeze your upper back. This is one of the best exercises for posture. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=cable+face+pull+beginner' },
    { id: 'e3', name: 'Cable Pull-Through', category: 'legs', sets: 3, notes: 'Set the cable at the lowest position. Stand facing away from it, reach between your legs and grab the rope. Stand up by driving your hips forward. This works your glutes and hamstrings. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=cable+pull+through+beginner' },
    { id: 'e4', name: 'Cable Pallof Press', category: 'core', sets: 3, notes: 'Stand sideways to a cable machine with the handle at chest height. Hold it at your chest with both hands, then press it straight out in front of you. The cable is trying to twist you — resist it. Hold for 2 seconds, return. Do 8-10 per side. One of the best core exercises that most people have never tried.', videoUrl: 'https://www.youtube.com/results?search_query=pallof+press+beginner' },
  ]},
  { id: 'se-gym-4', name: 'Machine Day', type: 'strength-endurance', equipment: 'full-gym', description: 'Machines guide the movement for you. Perfect for beginners — just sit, adjust, and push.', warmup: 'Start with 3-5 minutes of light movement to get your blood flowing — a brisk walk, jog in place, or jumping jacks. Then do 10 arm circles (forward and backward), 10 bodyweight squats, and 10 leg swings per side. The goal is to feel warm and loose, not tired.', modifications: 'If any exercise is too hard, reduce the range of motion (don\'t go as deep/far) or slow down. Push-ups can be done on your knees. Squats can be done to a chair (sit down and stand up). Rows can be done more upright. There\'s no shame in modifying — the goal is to move safely and build up over time.', exercises: [
    { id: 'e1', name: 'Chest Press Machine', category: 'push', sets: 3, notes: 'Sit in the chest press machine. Adjust the seat so the handles are at chest height. Push the handles forward until your arms are extended, then slowly let them back. Light weight, high reps. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=chest+press+machine+beginner' },
    { id: 'e2', name: 'Seated Row Machine', category: 'pull', sets: 3, notes: 'Sit at the row machine, grab the handles, and pull them toward your belly. Squeeze your shoulder blades together. Keep your back straight — don\'t lean back to cheat. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=seated+row+machine+beginner' },
    { id: 'e3', name: 'Leg Extension Machine', category: 'legs', sets: 3, notes: 'Sit in the leg extension machine, tuck your shins behind the pad, and extend your legs until straight. Lower slowly. Light weight — this isolates your quad muscles (front of thigh). Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=leg+extension+machine+beginner' },
    { id: 'e4', name: 'Hanging Knee Raise', category: 'core', sets: 3, notes: 'Hang from a pull-up bar. Slowly raise your knees toward your chest, pause, then lower with control. Don\'t swing — if you need to, bend your knees less or do the motion slower. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=hanging+knee+raise+beginner' },
  ]},
  { id: 'sh-bw-2', name: 'Gravity Is Enough', type: 'strength-hypertrophy', equipment: 'bodyweight', description: 'Advanced bodyweight variations that build real muscle. Harder than they look.', warmup: 'Start with 5 minutes of easy cardio — walk, jog, bike, jump rope, whatever gets your heart rate up slightly. Then do 1 warm-up set of each exercise at very light weight (or bodyweight) for 10-12 reps. This primes the muscles and joints for heavier work and reduces injury risk.', modifications: 'If an exercise is too difficult, reduce the weight first. If a movement hurts your joints, try a different grip or angle. Replace any exercise that causes pain (not muscle burn — actual joint pain). Dumbbell versions are usually easier on joints than barbell versions. If you\'re unsure about form, watch the linked video before starting.', exercises: [
    { id: 'e1', name: 'Archer Push-Ups', category: 'push', sets: 4, notes: 'Get in a wide push-up position. As you lower, shift your weight to one arm, straightening the other arm out to the side. Push back up. This is almost a one-arm push-up. Alternate sides. If too hard, do wide push-ups instead. Record reps per set.', videoUrl: 'https://www.youtube.com/results?search_query=archer+push+ups+beginner' },
    { id: 'e2', name: 'Backpack Rows', category: 'pull', sets: 4, notes: 'Fill a backpack with heavy books or cans. Lie under a table, wear the backpack on your chest, and do inverted rows. The extra weight makes your back work harder. Aim for 6-10 reps.', videoUrl: 'https://www.youtube.com/results?search_query=weighted+inverted+row' },
    { id: 'e3', name: 'Skater Squats', category: 'legs', sets: 4, notes: 'Stand on one leg. Bend that knee and lower your other knee toward the ground behind you (like a curtsy). Use a wall for balance if needed. Much harder than regular squats. Aim for 6-10 per leg.', videoUrl: 'https://www.youtube.com/results?search_query=skater+squat+beginner' },
    { id: 'e4', name: 'Plank Hold', category: 'core', sets: 4, notes: 'Get into a push-up position but rest on your forearms instead of your hands. Keep your body in a perfectly straight line from head to heels — don\'t let your hips sag or pike up. Hold as long as you can and count the seconds. That\'s your score to beat next time.', videoUrl: 'https://www.youtube.com/results?search_query=plank+hold+proper+form+beginner' },
  ]},
  { id: 'sh-diy-2', name: 'Heavy Carry Day', type: 'strength-hypertrophy', equipment: 'household', description: 'Loaded carries build everything — grip, core, legs, shoulders. Grab something heavy.', warmup: 'Start with 5 minutes of easy cardio — walk, jog, bike, jump rope, whatever gets your heart rate up slightly. Then do 1 warm-up set of each exercise at very light weight (or bodyweight) for 10-12 reps. This primes the muscles and joints for heavier work and reduces injury risk.', modifications: 'If an exercise is too difficult, reduce the weight first. If a movement hurts your joints, try a different grip or angle. Replace any exercise that causes pain (not muscle burn — actual joint pain). Dumbbell versions are usually easier on joints than barbell versions. If you\'re unsure about form, watch the linked video before starting.', exercises: [
    { id: 'e1', name: 'Sandbag Bear Hug Press', category: 'push', sets: 4, notes: 'Bear-hug a heavy sandbag at your chest. Press it overhead by any means necessary. This is messy and hard — that\'s the point. Aim for 6-10 reps. Make the bag heavier when it gets easy.', videoUrl: 'https://www.youtube.com/results?search_query=sandbag+press+overhead' },
    { id: 'e2', name: 'Sandbag Over-Shoulder Toss', category: 'pull', sets: 4, notes: 'Place the sandbag on the ground. Squat down, grab it, and in one explosive motion, pull it up and over one shoulder. Walk back, repeat over the other shoulder. Aim for 6-10 total.', videoUrl: 'https://www.youtube.com/results?search_query=sandbag+over+shoulder+toss' },
    { id: 'e3', name: 'Sandbag Front-Loaded Carry Squats', category: 'legs', sets: 4, notes: 'Bear-hug the heavy sandbag and squat. The awkward weight forces your core and legs to stabilize. Aim for 6-10 reps.', videoUrl: 'https://www.youtube.com/results?search_query=sandbag+front+squat' },
    { id: 'e4', name: 'Bucket Carry Plank', category: 'core', sets: 4, notes: 'Get into a plank position (forearms on ground). Reach one hand out and drag a bucket or heavy object from one side to the other, then switch arms. Your core has to fight the rotation — that\'s the whole point. Go until you can\'t maintain form.', videoUrl: 'https://www.youtube.com/results?search_query=plank+drag+exercise' },
  ]},
  { id: 'sh-kb-2', name: 'The Turkish Get-Up Day', type: 'strength-hypertrophy', equipment: 'kettlebell', description: 'Three movements that build functional, real-world strength.', warmup: 'Start with 5 minutes of easy cardio — walk, jog, bike, jump rope, whatever gets your heart rate up slightly. Then do 1 warm-up set of each exercise at very light weight (or bodyweight) for 10-12 reps. This primes the muscles and joints for heavier work and reduces injury risk.', modifications: 'If an exercise is too difficult, reduce the weight first. If a movement hurts your joints, try a different grip or angle. Replace any exercise that causes pain (not muscle burn — actual joint pain). Dumbbell versions are usually easier on joints than barbell versions. If you\'re unsure about form, watch the linked video before starting.', exercises: [
    { id: 'e1', name: 'KB Bottoms-Up Press', category: 'push', sets: 4, notes: 'Hold the kettlebell upside-down (bottom facing the ceiling) at your shoulder. Press it overhead while keeping it balanced. This forces incredible shoulder stability. Go lighter than you think. Aim for 6-10 per arm.', videoUrl: 'https://www.youtube.com/results?search_query=kettlebell+bottoms+up+press+beginner' },
    { id: 'e2', name: 'KB Renegade Row', category: 'pull', sets: 4, notes: 'Place two kettlebells on the floor. Get into a push-up position gripping the handles. Row one bell up to your hip while stabilizing with the other arm. Alternate. Aim for 6-10 per arm.', videoUrl: 'https://www.youtube.com/results?search_query=kettlebell+renegade+row+beginner' },
    { id: 'e3', name: 'KB Goblet Box Squat', category: 'legs', sets: 4, notes: 'Hold a heavy kettlebell at your chest. Stand in front of a bench or chair. Squat down and lightly touch the bench with your butt, then stand right back up. The bench teaches depth. Aim for 6-10 reps.', videoUrl: 'https://www.youtube.com/results?search_query=goblet+box+squat+beginner' },
    { id: 'e4', name: 'KB Windmill', category: 'core', sets: 4, notes: 'Hold a kettlebell overhead with one arm, locked out. Your feet are wider than shoulders, toes pointed slightly away from the bell. Slowly hinge at the hip and reach your free hand down toward your ankle. Keep your eyes on the bell. This stretches and strengthens your obliques. Do 5-8 per side.', videoUrl: 'https://www.youtube.com/results?search_query=kettlebell+windmill+beginner' },
  ]},
  { id: 'sh-db-3', name: 'Basement Builder', type: 'strength-hypertrophy', equipment: 'dumbbell', description: 'Heavy, focused, no-nonsense. Three moves that build real size.', warmup: 'Start with 5 minutes of easy cardio — walk, jog, bike, jump rope, whatever gets your heart rate up slightly. Then do 1 warm-up set of each exercise at very light weight (or bodyweight) for 10-12 reps. This primes the muscles and joints for heavier work and reduces injury risk.', modifications: 'If an exercise is too difficult, reduce the weight first. If a movement hurts your joints, try a different grip or angle. Replace any exercise that causes pain (not muscle burn — actual joint pain). Dumbbell versions are usually easier on joints than barbell versions. If you\'re unsure about form, watch the linked video before starting.', exercises: [
    { id: 'e1', name: 'Dumbbell Incline Press (floor, pillow under back)', category: 'push', sets: 4, notes: 'Stack a few firm pillows or a rolled towel under your upper back so you\'re at a slight angle. Press the dumbbells up from there. This targets the upper chest. Aim for 6-10 reps. Go heavier when 10 is easy.', videoUrl: 'https://www.youtube.com/results?search_query=dumbbell+incline+press+floor+beginner' },
    { id: 'e2', name: 'Dumbbell Pullover', category: 'pull', sets: 4, notes: 'Lie on the floor, hold one dumbbell with both hands above your chest. Lower it in an arc over your head toward the floor behind you, feeling the stretch in your lats, then pull it back. Aim for 6-10 reps.', videoUrl: 'https://www.youtube.com/results?search_query=dumbbell+pullover+form+beginner' },
    { id: 'e3', name: 'Dumbbell Goblet Squat (heavy)', category: 'legs', sets: 4, notes: 'Hold the heaviest dumbbell you can manage vertically at your chest. Squat deep. This is the same goblet squat as endurance day but with much more weight and fewer reps. Aim for 6-10.', videoUrl: 'https://www.youtube.com/results?search_query=heavy+goblet+squat+form' },
    { id: 'e4', name: 'Dumbbell Woodchop', category: 'core', sets: 4, notes: 'Hold one dumbbell with both hands. Start with it by your right hip, then sweep it diagonally up and across your body to above your left shoulder. Reverse the path. This trains the rotational power your core is designed for. Do 8-10 per side.', videoUrl: 'https://www.youtube.com/results?search_query=dumbbell+woodchop+exercise+beginner' },
  ]},
  { id: 'sh-db-4', name: 'The Slow Burner', type: 'strength-hypertrophy', equipment: 'dumbbell', description: 'Tempo work with dumbbells. Slow and controlled for maximum muscle growth.', warmup: 'Start with 5 minutes of easy cardio — walk, jog, bike, jump rope, whatever gets your heart rate up slightly. Then do 1 warm-up set of each exercise at very light weight (or bodyweight) for 10-12 reps. This primes the muscles and joints for heavier work and reduces injury risk.', modifications: 'If an exercise is too difficult, reduce the weight first. If a movement hurts your joints, try a different grip or angle. Replace any exercise that causes pain (not muscle burn — actual joint pain). Dumbbell versions are usually easier on joints than barbell versions. If you\'re unsure about form, watch the linked video before starting.', exercises: [
    { id: 'e1', name: 'Dumbbell Squeeze Press', category: 'push', sets: 4, notes: 'Hold two dumbbells together at your chest, actively squeezing them into each other. Press them up while maintaining that squeeze. This hits the inner chest hard. Aim for 6-10 reps.', videoUrl: 'https://www.youtube.com/results?search_query=dumbbell+squeeze+press+form' },
    { id: 'e2', name: 'Dumbbell Seal Row', category: 'pull', sets: 4, notes: 'Lie face-down on a bench or elevated surface. Let dumbbells hang below you. Row them up to your hips. Because you\'re face-down, you can\'t cheat with momentum. Aim for 6-10 reps.', videoUrl: 'https://www.youtube.com/results?search_query=dumbbell+seal+row+form' },
    { id: 'e3', name: 'Dumbbell Walking Lunge (heavy)', category: 'legs', sets: 4, notes: 'Hold heavy dumbbells at your sides. Take big, controlled steps forward into lunges. Keep your chest tall. Aim for 6-10 steps per leg.', videoUrl: 'https://www.youtube.com/results?search_query=heavy+dumbbell+walking+lunge' },
    { id: 'e4', name: 'Dumbbell Suitcase Carry', category: 'core', sets: 4, notes: 'Hold a heavy dumbbell in ONE hand only, at your side. Walk 30-40 yards. Your core has to fight to keep you from leaning sideways — that\'s an anti-lateral flexion exercise, and it builds real functional core strength. Switch hands and walk back.', videoUrl: 'https://www.youtube.com/results?search_query=suitcase+carry+exercise+beginner' },
  ]},
  { id: 'sh-gym-3', name: 'Power Hour', type: 'strength-hypertrophy', equipment: 'full-gym', description: 'Compound barbell lifts. The most efficient way to build total-body strength.', warmup: 'Start with 5 minutes of easy cardio — walk, jog, bike, jump rope, whatever gets your heart rate up slightly. Then do 1 warm-up set of each exercise at very light weight (or bodyweight) for 10-12 reps. This primes the muscles and joints for heavier work and reduces injury risk.', modifications: 'If an exercise is too difficult, reduce the weight first. If a movement hurts your joints, try a different grip or angle. Replace any exercise that causes pain (not muscle burn — actual joint pain). Dumbbell versions are usually easier on joints than barbell versions. If you\'re unsure about form, watch the linked video before starting.', exercises: [
    { id: 'e1', name: 'Overhead Press (barbell)', category: 'push', sets: 4, notes: 'Stand with the barbell at your shoulders. Press it straight overhead until arms are locked. Lower with control. This builds powerful shoulders. Aim for 6-10 reps. Add 5 lbs when all sets hit 10.', videoUrl: 'https://www.youtube.com/results?search_query=barbell+overhead+press+form+beginner' },
    { id: 'e2', name: 'Pull-Ups (assisted if needed)', category: 'pull', sets: 4, notes: 'Grab the pull-up bar with palms facing away, hands wider than shoulders. Pull yourself up until your chin clears the bar. If you can\'t do one yet, use the assisted pull-up machine or a resistance band looped over the bar for help. Aim for 6-10 reps.', videoUrl: 'https://www.youtube.com/results?search_query=pull+up+beginner+progression' },
    { id: 'e3', name: 'Barbell Romanian Deadlift', category: 'legs', sets: 4, notes: 'Hold the barbell in front of your thighs. With slightly bent knees, hinge forward at the hips, lowering the bar along your legs until you feel a deep stretch in the back of your thighs. Stand back up. Aim for 6-10 reps.', videoUrl: 'https://www.youtube.com/results?search_query=barbell+romanian+deadlift+beginner' },
    { id: 'e4', name: 'Ab Wheel Rollout (or barbell rollout)', category: 'core', sets: 4, notes: 'Kneel on the floor, grip an ab wheel or a loaded barbell. Roll it forward, extending your body, then pull it back using your abs. Only go as far as you can control — don\'t collapse. Start small and increase range over time. Do 6-10 reps.', videoUrl: 'https://www.youtube.com/results?search_query=ab+wheel+rollout+beginner' },
  ]},
  { id: 'sh-gym-4', name: 'Sled & Iron', type: 'strength-hypertrophy', equipment: 'full-gym', description: 'Heavy sled work plus a barbell finisher. Total body strength.', warmup: 'Start with 5 minutes of easy cardio — walk, jog, bike, jump rope, whatever gets your heart rate up slightly. Then do 1 warm-up set of each exercise at very light weight (or bodyweight) for 10-12 reps. This primes the muscles and joints for heavier work and reduces injury risk.', modifications: 'If an exercise is too difficult, reduce the weight first. If a movement hurts your joints, try a different grip or angle. Replace any exercise that causes pain (not muscle burn — actual joint pain). Dumbbell versions are usually easier on joints than barbell versions. If you\'re unsure about form, watch the linked video before starting.', exercises: [
    { id: 'e1', name: 'Heavy Sled Push', category: 'push', sets: 4, notes: 'Load the sled heavy — heavier than endurance day. Push it for 20-30 yards. Your legs, chest, and arms all work. Rest 90 seconds between sets. Track the weight on the sled.', videoUrl: 'https://www.youtube.com/results?search_query=heavy+sled+push+form' },
    { id: 'e2', name: 'Barbell Pendlay Row', category: 'pull', sets: 4, notes: 'Bend at the hips so your back is nearly parallel to the floor. The barbell starts on the ground. Pull it explosively to your lower chest, lower it all the way back to the floor. Each rep starts from a dead stop. Aim for 6-10 reps.', videoUrl: 'https://www.youtube.com/results?search_query=pendlay+row+form+beginner' },
    { id: 'e3', name: 'Barbell Hack Squat', category: 'legs', sets: 4, notes: 'Hold a barbell behind your legs (behind your calves). Stand up by extending your legs, then lower back down. It\'s like a squat but the weight is behind you, which hits your quads differently. Aim for 6-10 reps.', videoUrl: 'https://www.youtube.com/results?search_query=barbell+hack+squat+form' },
    { id: 'e4', name: 'Cable Woodchop', category: 'core', sets: 4, notes: 'Set the cable high. Grab the handle with both hands and pull it diagonally down and across your body to your opposite hip, rotating your torso. Control it back up. This builds rotational core power. Do 8-10 per side.', videoUrl: 'https://www.youtube.com/results?search_query=cable+woodchop+exercise+beginner' },
  ]},
  { id: 'cl2-5', name: 'The Family Walk', type: 'cardio-l2', equipment: 'bodyweight', description: 'Bring the whole family. Walk and talk. Model healthy habits for your kids.', warmup: 'Start the first 5 minutes of your session at an easy pace — slower than your target pace. Let your body warm up gradually. Do a few gentle stretches if anything feels tight, but don\'t force it. Your pace will naturally increase as your body warms up.', modifications: 'If walking doesn\'t get your heart rate up enough, walk faster, add hills, wear a weighted backpack, or switch to an easy jog or bike ride. If you have bad knees, cycling or swimming are great low-impact alternatives. If you can only do 20 minutes to start, that\'s fine — build up by adding 5 minutes each week.', exercises: [
    { id: 'e1', name: 'Family Walk', category: 'cardio', sets: 1, notes: 'Walk with your family for 45-60 minutes. Match the pace of your slowest member — this is about consistency and time on your feet, not speed. If you need more challenge, carry a child on your shoulders or wear a loaded backpack.' },
  ]},
  { id: 'cl2-6', name: 'Swim Day', type: 'cardio-l2', equipment: 'bodyweight', description: 'If you have access to a pool or lake, swimming is one of the best low-impact cardio options.', warmup: 'Start the first 5 minutes of your session at an easy pace — slower than your target pace. Let your body warm up gradually. Do a few gentle stretches if anything feels tight, but don\'t force it. Your pace will naturally increase as your body warms up.', modifications: 'If walking doesn\'t get your heart rate up enough, walk faster, add hills, wear a weighted backpack, or switch to an easy jog or bike ride. If you have bad knees, cycling or swimming are great low-impact alternatives. If you can only do 20 minutes to start, that\'s fine — build up by adding 5 minutes each week.', exercises: [
    { id: 'e1', name: 'Steady Swimming', category: 'cardio', sets: 1, notes: 'Swim at an easy, continuous pace for 30-45 minutes. Any stroke works. If you can\'t swim that long continuously, swim a lap, rest at the wall for 15-20 seconds, then go again. The goal is to keep moving. If the pace feels too easy, swim faster or use a harder stroke.' },
  ]},
  { id: 'cl2-7', name: 'Row Steady', type: 'cardio-l2', equipment: 'full-gym', description: 'The rowing machine is a hidden gem. Full body, low impact, great cardio.', warmup: 'Start the first 5 minutes of your session at an easy pace — slower than your target pace. Let your body warm up gradually. Do a few gentle stretches if anything feels tight, but don\'t force it. Your pace will naturally increase as your body warms up.', modifications: 'If walking doesn\'t get your heart rate up enough, walk faster, add hills, wear a weighted backpack, or switch to an easy jog or bike ride. If you have bad knees, cycling or swimming are great low-impact alternatives. If you can only do 20 minutes to start, that\'s fine — build up by adding 5 minutes each week.', exercises: [
    { id: 'e1', name: 'Steady State Rowing', category: 'cardio', sets: 1, notes: 'Row at a comfortable, steady pace for 30-45 minutes. Keep your stroke rate around 20-24 strokes per minute. Focus on smooth, full strokes — push with your legs first, then lean back slightly, then pull arms. If it\'s too easy, increase resistance or pull harder.' },
  ]},
  { id: 'cvo2-8', name: 'The Rowing Rocket', type: 'cardio-vo2max', equipment: 'full-gym', description: 'Rowing intervals. All the intensity, none of the impact on your joints.', warmup: 'This is the one workout where warming up is critical — don\'t skip it. Do 5 minutes of easy movement (walk, light jog, easy pedal). Then do 2-3 short pickups at about 70% effort for 10-15 seconds each. This preps your heart and muscles for the intense intervals ahead.', modifications: 'If the prescribed intervals are too intense, reduce the work time (20 seconds instead of 30) or increase the rest time (2 minutes instead of 90 seconds). If running hurts your joints, substitute cycling, rowing, or burpees. If you\'re brand new to high-intensity work, start with just 4-5 rounds instead of 8-10 and build up.', exercises: [
    { id: 'e1', name: 'Rowing Intervals', category: 'cardio', sets: 1, notes: 'After a 3-minute easy warmup: row as hard and fast as you can for 30 seconds, then row easy for 60 seconds. Do 8-10 rounds. Watch the watts or calories per hour — try to hit a higher number each interval. You should be gasping during the work intervals.' },
  ]},
  { id: 'cvo2-9', name: 'Kettlebell Cardio Blast', type: 'cardio-vo2max', equipment: 'kettlebell', description: 'Kettlebell swings are cardio disguised as strength training. This will empty the tank.', warmup: 'This is the one workout where warming up is critical — don\'t skip it. Do 5 minutes of easy movement (walk, light jog, easy pedal). Then do 2-3 short pickups at about 70% effort for 10-15 seconds each. This preps your heart and muscles for the intense intervals ahead.', modifications: 'If the prescribed intervals are too intense, reduce the work time (20 seconds instead of 30) or increase the rest time (2 minutes instead of 90 seconds). If running hurts your joints, substitute cycling, rowing, or burpees. If you\'re brand new to high-intensity work, start with just 4-5 rounds instead of 8-10 and build up.', exercises: [
    { id: 'e1', name: 'Kettlebell Swing Intervals', category: 'cardio', sets: 1, notes: 'Do 20 kettlebell swings (hip hinge, snap hips forward, bell swings to chest height), then rest 30 seconds. Repeat for 10-12 rounds. By round 5, you\'ll understand why this counts as cardio. Use a weight that\'s challenging but lets you keep good form.' },
  ]},
  { id: 'se-bw-classic', name: 'Back to Basics', type: 'strength-endurance', equipment: 'bodyweight', description: 'The classics for a reason. Push-ups, pull-ups, squats, and a plank. No frills. Just results.', warmup: 'Start with 3-5 minutes of light movement to get your blood flowing — a brisk walk, jog in place, or jumping jacks. Then do 10 arm circles (forward and backward), 10 bodyweight squats, and 10 leg swings per side. The goal is to feel warm and loose, not tired.', modifications: 'If any exercise is too hard, reduce the range of motion (don\'t go as deep/far) or slow down. Push-ups can be done on your knees. Squats can be done to a chair (sit down and stand up). Rows can be done more upright. There\'s no shame in modifying — the goal is to move safely and build up over time.', exercises: [
    { id: 'e1', name: 'Push-Ups', category: 'push', sets: 3, notes: 'Hands shoulder-width apart, lower your chest to the floor, push back up. The most fundamental upper body exercise there is. On your knees if needed. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=push+up+proper+form+beginner' },
    { id: 'e2', name: 'Pull-Ups (or assisted)', category: 'pull', sets: 3, notes: 'Hang from a bar or sturdy tree branch with palms facing away. Pull yourself up until your chin clears the bar. If you can\'t do one, jump up and lower yourself as slowly as possible — that\'s called a \'negative\' and it builds strength fast. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=pull+up+beginner+progression' },
    { id: 'e3', name: 'Bodyweight Lunges', category: 'legs', sets: 3, notes: 'Step forward into a lunge — front thigh parallel to the floor, back knee almost touching the ground. Push back to standing. Alternate legs. The most functional leg exercise you can do — it mimics how you actually move in life. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=bodyweight+lunge+proper+form+beginner' },
    { id: 'e4', name: 'Plank Hold', category: 'core', sets: 3, notes: 'Forearms on the floor, body straight as a board from head to heels. Hold as long as you can. Don\'t let your hips sag. Count the seconds — that\'s your score.', videoUrl: 'https://www.youtube.com/results?search_query=plank+hold+proper+form+beginner' },
  ]},
  { id: 'sh-db-classic', name: 'The No-Nonsense Six', type: 'strength-hypertrophy', equipment: 'dumbbell', description: 'Six classic exercises that have built more muscle than anything else. Proven, simple, effective.', warmup: 'Start with 5 minutes of easy cardio — walk, jog, bike, jump rope, whatever gets your heart rate up slightly. Then do 1 warm-up set of each exercise at very light weight (or bodyweight) for 10-12 reps. This primes the muscles and joints for heavier work and reduces injury risk.', modifications: 'If an exercise is too difficult, reduce the weight first. If a movement hurts your joints, try a different grip or angle. Replace any exercise that causes pain (not muscle burn — actual joint pain). Dumbbell versions are usually easier on joints than barbell versions. If you\'re unsure about form, watch the linked video before starting.', exercises: [
    { id: 'e1', name: 'Dumbbell Bench Press', category: 'push', sets: 4, notes: 'Lie on a bench or the floor. Hold dumbbells at chest level, press straight up until arms are extended, lower with control. The bench press has been the gold standard for chest strength for a century. Aim for 6-10 reps. Add 5 lbs when all sets hit 10.', videoUrl: 'https://www.youtube.com/results?search_query=dumbbell+bench+press+form+beginner' },
    { id: 'e2', name: 'Dumbbell Row', category: 'pull', sets: 4, notes: 'One knee and hand on a bench, other hand holds a dumbbell. Pull it up to your hip, squeezing your back. Lower with control. Rows are the counterbalance to pressing — they build your back and improve your posture. Aim for 6-10 reps per arm.', videoUrl: 'https://www.youtube.com/results?search_query=single+arm+dumbbell+row+form+beginner' },
    { id: 'e3', name: 'Dumbbell Goblet Squat', category: 'legs', sets: 4, notes: 'Hold one dumbbell vertically at your chest. Squat as deep as you can with good form. The goblet position naturally teaches you to squat correctly — it keeps your chest up and your weight centered. Aim for 6-10 reps.', videoUrl: 'https://www.youtube.com/results?search_query=dumbbell+goblet+squat+form+beginner' },
    { id: 'e4', name: 'Dumbbell Farmer\'s Carry', category: 'core', sets: 4, notes: 'Hold a heavy dumbbell in each hand. Walk 30-40 yards with perfect posture. This looks simple but it works your grip, core, shoulders, and traps all at once. If you could only do one core exercise, this would be it.', videoUrl: 'https://www.youtube.com/results?search_query=farmers+carry+exercise+beginner' },
  ]},
  { id: 'sh-gym-classic', name: 'The Big Three', type: 'strength-hypertrophy', equipment: 'full-gym', description: 'Bench, squat, and row. Three barbell movements that form the foundation of every serious strength program.', warmup: 'Start with 5 minutes of easy cardio — walk, jog, bike, jump rope, whatever gets your heart rate up slightly. Then do 1 warm-up set of each exercise at very light weight (or bodyweight) for 10-12 reps. This primes the muscles and joints for heavier work and reduces injury risk.', modifications: 'If an exercise is too difficult, reduce the weight first. If a movement hurts your joints, try a different grip or angle. Replace any exercise that causes pain (not muscle burn — actual joint pain). Dumbbell versions are usually easier on joints than barbell versions. If you\'re unsure about form, watch the linked video before starting.', exercises: [
    { id: 'e1', name: 'Barbell Bench Press', category: 'push', sets: 4, notes: 'Lie on the bench, grip the bar just wider than shoulder-width. Lower it to your mid-chest, press it back up. Start with just the bar (45 lbs) if you\'re new. There\'s no better exercise for building a strong chest, shoulders, and arms. Aim for 6-10 reps.', videoUrl: 'https://www.youtube.com/results?search_query=barbell+bench+press+form+beginner' },
    { id: 'e2', name: 'Barbell Row', category: 'pull', sets: 4, notes: 'Stand, bend at the hips with a flat back, grip the bar just wider than shoulder-width. Pull the bar to your lower chest, squeeze your back, lower with control. This balances out all your pressing and builds a strong, thick back. Aim for 6-10 reps.', videoUrl: 'https://www.youtube.com/results?search_query=barbell+row+form+beginner' },
    { id: 'e3', name: 'Barbell Back Squat', category: 'legs', sets: 4, notes: 'Bar across your upper back (not your neck), feet shoulder-width. Squat until your thighs are at least parallel to the floor, then drive up. The squat is called the king of exercises for a reason — it builds your legs, core, and overall strength like nothing else. Aim for 6-10 reps.', videoUrl: 'https://www.youtube.com/results?search_query=barbell+back+squat+form+beginner' },
    { id: 'e4', name: 'Hanging Knee Raise', category: 'core', sets: 4, notes: 'Hang from a pull-up bar. Raise your knees to your chest, pause, lower with control. If you can\'t hang long enough, do these on a captain\'s chair (the padded arm-rest station) or lying on the floor as reverse crunches. Aim for as many as you can.', videoUrl: 'https://www.youtube.com/results?search_query=hanging+knee+raise+beginner' },
  ]},
  { id: 'se-gym-classic', name: 'The Starter Pack', type: 'strength-endurance', equipment: 'full-gym', description: 'First time in a gym? Start here. Machines and simple movements that teach the basics.', warmup: 'Start with 3-5 minutes of light movement to get your blood flowing — a brisk walk, jog in place, or jumping jacks. Then do 10 arm circles (forward and backward), 10 bodyweight squats, and 10 leg swings per side. The goal is to feel warm and loose, not tired.', modifications: 'If any exercise is too hard, reduce the range of motion (don\'t go as deep/far) or slow down. Push-ups can be done on your knees. Squats can be done to a chair (sit down and stand up). Rows can be done more upright. There\'s no shame in modifying — the goal is to move safely and build up over time.', exercises: [
    { id: 'e1', name: 'Chest Press Machine', category: 'push', sets: 3, notes: 'Adjust the seat so handles are at chest height. Push forward until arms are extended, slowly return. Machines guide the movement so you can focus on effort, not balance. Great for learning the pressing motion. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=chest+press+machine+beginner' },
    { id: 'e2', name: 'Lat Pulldown', category: 'pull', sets: 3, notes: 'Sit at the pulldown machine, grab the wide bar, pull it to your upper chest. This is the machine version of a pull-up and builds the same muscles. Think about pulling with your back, not your arms. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=lat+pulldown+proper+form+beginner' },
    { id: 'e3', name: 'Leg Press', category: 'legs', sets: 3, notes: 'Sit in the machine, feet shoulder-width on the platform. Push until legs are almost straight (don\'t lock your knees), slowly lower back. This is the safest way to build leg strength while you learn proper squat form. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=leg+press+form+beginner' },
    { id: 'e4', name: 'Cable Pallof Press', category: 'core', sets: 3, notes: 'Stand sideways to the cable machine, handle at chest height. Press it straight out in front of you and resist the cable\'s pull. Hold 2 seconds, return. This is anti-rotation training — it builds the core stability you use every day. Do 8-10 per side.', videoUrl: 'https://www.youtube.com/results?search_query=pallof+press+beginner' },
  ]},
  { id: 'se-kb-classic', name: 'Kettlebell Essentials', type: 'strength-endurance', equipment: 'kettlebell', description: 'The four kettlebell moves every beginner should learn. Simple, effective, and time-tested.', warmup: 'Start with 3-5 minutes of light movement to get your blood flowing — a brisk walk, jog in place, or jumping jacks. Then do 10 arm circles (forward and backward), 10 bodyweight squats, and 10 leg swings per side. The goal is to feel warm and loose, not tired.', modifications: 'If any exercise is too hard, reduce the range of motion (don\'t go as deep/far) or slow down. Push-ups can be done on your knees. Squats can be done to a chair (sit down and stand up). Rows can be done more upright. There\'s no shame in modifying — the goal is to move safely and build up over time.', exercises: [
    { id: 'e1', name: 'Kettlebell Overhead Press', category: 'push', sets: 3, notes: 'Hold the bell at your shoulder. Press it straight overhead. Lower with control. Alternate arms each set. The overhead press builds strong, functional shoulders that you use every time you put something on a high shelf. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=kettlebell+press+form+beginner' },
    { id: 'e2', name: 'Kettlebell Swing', category: 'pull', sets: 3, notes: 'Feet wider than shoulders. Hike the bell between your legs, then snap your hips forward to swing it to chest height. Your hips do the work, not your arms. The swing is the foundation of kettlebell training and one of the best total-body exercises. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=kettlebell+swing+form+beginner' },
    { id: 'e3', name: 'Kettlebell Goblet Squat', category: 'legs', sets: 3, notes: 'Hold the bell by the horns at your chest. Squat deep, elbows touching the inside of your knees at the bottom. This naturally teaches perfect squat form. Go until you can\'t do another one.', videoUrl: 'https://www.youtube.com/results?search_query=kettlebell+goblet+squat+form+beginner' },
    { id: 'e4', name: 'KB Turkish Get-Up (half)', category: 'core', sets: 3, notes: 'Lie on your back, bell held straight up with one arm. Sit up to your elbow, then your hand, then lift your hips. Reverse back down. 3-5 per arm. This single exercise builds core stability, shoulder strength, and body awareness like nothing else.', videoUrl: 'https://www.youtube.com/results?search_query=half+turkish+get+up+beginner' },
  ]},
];

const EQUIPMENT_OPTIONS = [
  { id: "bodyweight", label: "Bodyweight", icon: "🏋️", desc: "Just you and gravity" },
  { id: "household", label: "Household / DIY", icon: "🪨", desc: "Sandbags, kids, creativity" },
  { id: "kettlebell", label: "Kettlebell", icon: "🔔", desc: "The COVID purchase that pays off" },
  { id: "dumbbell", label: "Dumbbell", icon: "💪", desc: "Home gym staple" },
  { id: "full-gym", label: "Full Gym", icon: "🏢", desc: "Barbells, cables, sleds, the works" },
];

const WORKOUT_TYPES = {
  "strength-endurance": { label: "Strength: Endurance", short: "Endurance", color: "#E07A5F", icon: "🔥" },
  "strength-hypertrophy": { label: "Strength: Hypertrophy", short: "Hypertrophy", color: "#3D405B", icon: "⚡" },
  "cardio-l2": { label: "Cardio: L2 Steady State", short: "L2 Cardio", color: "#81B29A", icon: "🫁" },
  "cardio-vo2max": { label: "Cardio: VO2 Max", short: "VO2 Max", color: "#F2CC8F", icon: "💀" },
};

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// ============================================================
// STORAGE HELPERS
// ============================================================
async function loadData(key, fallback) {
  try {
    const result = await window.storage.get(key);
    return result ? JSON.parse(result.value) : fallback;
  } catch { return fallback; }
}
async function saveData(key, value) {
  try {
    await window.storage.set(key, JSON.stringify(value));
  } catch (e) { console.error("Save error:", e); }
}

// ============================================================
// MAIN APP
// ============================================================
export default function DadLiftApp() {
  const [screen, setScreen] = useState("loading");
  const [onboardStep, setOnboardStep] = useState(0);
  const [equipment, setEquipment] = useState([]);
  const [weekPlan, setWeekPlan] = useState({});
  const [workoutLogs, setWorkoutLogs] = useState({});
  const [customWorkouts, setCustomWorkouts] = useState([]);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [browseFilter, setBrowseFilter] = useState({ type: null, equip: null });
  const [planSlot, setPlanSlot] = useState(null); // { day, type } when assigning from library
  const [showInfo, setShowInfo] = useState(false);
  const [monthLabel, setMonthLabel] = useState("");
  const scrollRef = useRef(null);

  // Load persisted data on mount
  useEffect(() => {
    (async () => {
      const eq = await loadData("dadliftEquipment", null);
      const wp = await loadData("dadliftWeekPlan", {});
      const wl = await loadData("dadliftWorkoutLogs", {});
      const ml = await loadData("dadliftMonthLabel", "");
      const cw = await loadData("dadliftCustomWorkouts", []);
      const onboarded = await loadData("dadliftOnboarded", false);
      setEquipment(eq || []);
      setWeekPlan(wp);
      setWorkoutLogs(wl);
      setCustomWorkouts(cw || []);
      setMonthLabel(ml);
      setScreen(onboarded ? "plan" : "onboard");
    })();
  }, []);

  // Save helpers
  const saveEquipment = async (eq) => { setEquipment(eq); await saveData("dadliftEquipment", eq); };
  const saveWeekPlan = async (wp) => { setWeekPlan(wp); await saveData("dadliftWeekPlan", wp); };
  const saveWorkoutLogs = async (wl) => { setWorkoutLogs(wl); await saveData("dadliftWorkoutLogs", wl); };
  const saveCustomWorkouts = async (cw) => { setCustomWorkouts(cw); await saveData("dadliftCustomWorkouts", cw); };
  const saveMonthLabel = async (ml) => { setMonthLabel(ml); await saveData("dadliftMonthLabel", ml); };

  const completeOnboarding = async () => {
    await saveData("dadliftOnboarded", true);
    setScreen("plan");
  };

  const scrollToTop = () => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  };

  const navigateTo = (s) => { setScreen(s); scrollToTop(); };

  // All workouts = built-in + custom
  const ALL_WORKOUTS = [...WORKOUTS, ...customWorkouts];

  // Get workouts for user's equipment
  const myWorkouts = ALL_WORKOUTS.filter(w =>
    w.equipment === "bodyweight" || equipment.includes(w.equipment)
  );

  // Filtered library workouts
  const filteredWorkouts = myWorkouts.filter(w => {
    if (browseFilter.type && w.type !== browseFilter.type) return false;
    if (browseFilter.equip && w.equipment !== browseFilter.equip) return false;
    return true;
  });

  // Get last log for a workout
  const getLastLog = (workoutId) => {
    const logs = workoutLogs[workoutId];
    if (!logs || logs.length === 0) return null;
    return logs[logs.length - 1];
  };

  // ============================================================
  // STYLES
  // ============================================================
  const theme = {
    bg: "#1A1A2E",
    card: "#16213E",
    cardAlt: "#0F3460",
    accent: "#E94560",
    accentSoft: "#E9456033",
    text: "#EAEAEA",
    textMuted: "#8B8FA3",
    textDim: "#5C6078",
    success: "#81B29A",
    warning: "#F2CC8F",
    border: "#2A2D45",
    font: "'Outfit', sans-serif",
    fontDisplay: "'Bebas Neue', sans-serif",
  };

  const styles = {
    app: {
      fontFamily: theme.font,
      background: theme.bg,
      color: theme.text,
      minHeight: "100vh",
      maxWidth: 480,
      margin: "0 auto",
      position: "relative",
      overflow: "hidden",
    },
    scrollArea: {
      height: "100vh",
      overflowY: "auto",
      paddingBottom: 100,
      WebkitOverflowScrolling: "touch",
    },
    header: {
      padding: "16px 20px 8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottom: `1px solid ${theme.border}`,
      background: theme.bg,
      position: "sticky",
      top: 0,
      zIndex: 10,
    },
    logo: {
      fontFamily: theme.fontDisplay,
      fontSize: 28,
      letterSpacing: 2,
      color: theme.accent,
      margin: 0,
    },
    page: { padding: "16px 20px" },
    h1: { fontFamily: theme.fontDisplay, fontSize: 32, letterSpacing: 1, margin: "0 0 8px", lineHeight: 1.1 },
    h2: { fontFamily: theme.fontDisplay, fontSize: 24, letterSpacing: 1, margin: "24px 0 12px", lineHeight: 1.1 },
    h3: { fontFamily: theme.fontDisplay, fontSize: 20, letterSpacing: 1, margin: "16px 0 8px", lineHeight: 1.1 },
    p: { color: theme.textMuted, fontSize: 15, lineHeight: 1.6, margin: "0 0 16px" },
    card: {
      background: theme.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      border: `1px solid ${theme.border}`,
    },
    btn: {
      background: theme.accent,
      color: "#fff",
      border: "none",
      borderRadius: 12,
      padding: "14px 24px",
      fontSize: 16,
      fontWeight: 600,
      fontFamily: theme.font,
      cursor: "pointer",
      width: "100%",
      textAlign: "center",
      letterSpacing: 0.5,
    },
    btnOutline: {
      background: "transparent",
      color: theme.accent,
      border: `2px solid ${theme.accent}`,
      borderRadius: 12,
      padding: "12px 20px",
      fontSize: 15,
      fontWeight: 600,
      fontFamily: theme.font,
      cursor: "pointer",
      width: "100%",
      textAlign: "center",
    },
    btnSmall: {
      background: theme.cardAlt,
      color: theme.text,
      border: `1px solid ${theme.border}`,
      borderRadius: 10,
      padding: "10px 16px",
      fontSize: 14,
      fontFamily: theme.font,
      cursor: "pointer",
      textAlign: "center",
    },
    chip: (active) => ({
      display: "inline-block",
      padding: "8px 14px",
      borderRadius: 20,
      fontSize: 13,
      fontWeight: 600,
      fontFamily: theme.font,
      cursor: "pointer",
      border: active ? `2px solid ${theme.accent}` : `1px solid ${theme.border}`,
      background: active ? theme.accentSoft : theme.card,
      color: active ? theme.accent : theme.textMuted,
      marginRight: 8,
      marginBottom: 8,
    }),
    tag: (color) => ({
      display: "inline-block",
      padding: "4px 10px",
      borderRadius: 8,
      fontSize: 11,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: 1,
      background: color + "22",
      color: color,
      marginRight: 6,
    }),
    nav: {
      position: "fixed",
      bottom: 0,
      left: "50%",
      transform: "translateX(-50%)",
      width: "100%",
      maxWidth: 480,
      background: theme.card,
      borderTop: `1px solid ${theme.border}`,
      display: "flex",
      justifyContent: "space-around",
      padding: "8px 0 max(8px, env(safe-area-inset-bottom))",
      zIndex: 20,
    },
    navBtn: (active) => ({
      background: "none",
      border: "none",
      color: active ? theme.accent : theme.textDim,
      fontSize: 11,
      fontFamily: theme.font,
      fontWeight: active ? 700 : 400,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 2,
      cursor: "pointer",
      padding: "4px 12px",
    }),
    input: {
      width: "100%",
      background: theme.cardAlt,
      border: `1px solid ${theme.border}`,
      borderRadius: 10,
      padding: "12px 14px",
      color: theme.text,
      fontSize: 16,
      fontFamily: theme.font,
      boxSizing: "border-box",
    },
    backBtn: {
      background: "none",
      border: "none",
      color: theme.textMuted,
      fontSize: 24,
      cursor: "pointer",
      padding: "4px 8px",
      marginRight: 8,
    },
  };

  // ============================================================
  // ONBOARDING
  // ============================================================
  const onboardScreens = [
    // Welcome
    () => (
      <div style={{ ...styles.page, display: "flex", flexDirection: "column", justifyContent: "center", minHeight: "80vh", textAlign: "center" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>👨‍👧‍👦</div>
        <h1 style={{ ...styles.h1, fontSize: 40, color: theme.accent }}>DADLIFT</h1>
        <p style={{ ...styles.p, fontSize: 18, maxWidth: 320, margin: "0 auto 24px" }}>
          The fitness app for dads who want to show up — for their kids, their partner, and themselves.
        </p>
        <button style={styles.btn} onClick={() => setOnboardStep(1)}>Let's Go</button>
      </div>
    ),
    // Value prop
    () => (
      <div style={{ ...styles.page, minHeight: "80vh" }}>
        <h1 style={{ ...styles.h1, fontSize: 28 }}>YOU DON'T NEED TO BE A COMMANDO.</h1>
        <p style={{ ...styles.p, fontSize: 16, marginTop: 16 }}>You just need to:</p>
        <div style={{ ...styles.card, borderLeft: `4px solid ${theme.accent}` }}>
          <p style={{ margin: "0 0 14px", fontSize: 16, lineHeight: 1.6, color: theme.text }}>Have the energy to keep up with your kids</p>
          <p style={{ margin: "0 0 14px", fontSize: 16, lineHeight: 1.6, color: theme.text }}>Be healthy enough to play with your grandkids someday</p>
          <p style={{ margin: "0 0 14px", fontSize: 16, lineHeight: 1.6, color: theme.text }}>Be strong enough to help the people who need you</p>
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: theme.text }}>Feel good and look good enough that your wife notices</p>
        </div>
        <p style={{ ...styles.p, marginTop: 16, fontSize: 16 }}>
          DadLift gives you the 20% of fitness knowledge that delivers 80% of the results. No confusion. No overwhelm. No six-pack promises. Just a simple, proven system that gets you stronger, healthier, and more capable — starting this week.
        </p>
        <button style={styles.btn} onClick={() => setOnboardStep(2)}>How It Works →</button>
      </div>
    ),
    // How it works
    () => (
      <div style={{ ...styles.page, minHeight: "80vh" }}>
        <h1 style={{ ...styles.h1, fontSize: 28 }}>THE SYSTEM: 4 WORKOUTS A WEEK</h1>
        <p style={styles.p}>Every week follows the same simple template. No thinking required.</p>
        {Object.entries(WORKOUT_TYPES).map(([key, t]) => (
          <div key={key} style={{ ...styles.card, borderLeft: `4px solid ${t.color}`, marginBottom: 10, padding: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: t.color, flexShrink: 0 }} />
              <strong style={{ fontSize: 15 }}>{t.label}</strong>
            </div>
            <p style={{ ...styles.p, fontSize: 13, margin: "6px 0 0" }}>
              {key === "strength-endurance" && "Full-body workout with light or no weight. You'll build the stamina to carry groceries, haul kids, and power through a long day without feeling wiped out."}
              {key === "strength-hypertrophy" && "Full-body workout with heavier weights and fewer reps. This is how you gain muscle, fill out a t-shirt, and build the kind of strength people notice."}
              {key === "cardio-l2" && "A longer, easy-paced session — walking, jogging, cycling, whatever you enjoy. This is what keeps your heart healthy, your stress low, and your energy steady all day. 45-60+ minutes."}
              {key === "cardio-vo2max" && "Short, intense bursts — hill sprints, bike intervals, burpees. This builds the kind of fitness that lets you sprint after your kid without gasping for air. 20-30 minutes total."}
            </p>
          </div>
        ))}
        <p style={{ ...styles.p, fontSize: 13, marginTop: 8 }}>
          Every strength workout hits your full body — chest, back, arms, and legs — in a single session. No complicated schedules. Just show up, follow the workout, and you're covered.
        </p>
        <button style={styles.btn} onClick={() => setOnboardStep(3)}>Got It →</button>
      </div>
    ),
    // Monthly rotation
    () => (
      <div style={{ ...styles.page, minHeight: "80vh" }}>
        <h1 style={{ ...styles.h1, fontSize: 28 }}>MONTHLY ROTATION</h1>
        <p style={styles.p}>
          Pick your 4 workouts. Run them for a month. Then swap in new ones.
        </p>
        <div style={styles.card}>
          <p style={{ margin: "0 0 8px", fontSize: 15 }}>🔁 <strong>Why rotate monthly?</strong></p>
          <p style={{ ...styles.p, fontSize: 14, margin: 0 }}>
            Cross-training different movements and muscle groups keeps your body adapting and prevents plateaus. Plus it keeps things fresh — you never get bored.
          </p>
        </div>
        <div style={styles.card}>
          <p style={{ margin: "0 0 8px", fontSize: 15 }}>📈 <strong>Tracking progress</strong></p>
          <p style={{ ...styles.p, fontSize: 14, margin: 0 }}>
            On endurance days, track max reps. Beat last week's number.
            On hypertrophy days, track weight. When you hit all your reps, add weight next time.
            On cardio, just log that you did it. Consistency wins.
          </p>
        </div>
        <button style={styles.btn} onClick={() => setOnboardStep(4)}>Almost Done →</button>
      </div>
    ),
    // Equipment selection
    () => (
      <div style={{ ...styles.page, minHeight: "80vh" }}>
        <h1 style={{ ...styles.h1, fontSize: 28 }}>WHAT DO YOU HAVE ACCESS TO?</h1>
        <p style={styles.p}>Select all that apply. Bodyweight workouts are always available. You can change this anytime.</p>
        {EQUIPMENT_OPTIONS.filter(e => e.id !== "bodyweight").map(eq => (
          <div key={eq.id}
            onClick={() => {
              const next = equipment.includes(eq.id) ? equipment.filter(e => e !== eq.id) : [...equipment, eq.id];
              setEquipment(next);
            }}
            style={{
              ...styles.card,
              display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
              border: equipment.includes(eq.id) ? `2px solid ${theme.accent}` : `1px solid ${theme.border}`,
              background: equipment.includes(eq.id) ? theme.accentSoft : theme.card,
            }}>
            <span style={{ fontSize: 28 }}>{eq.icon}</span>
            <div>
              <strong style={{ fontSize: 15 }}>{eq.label}</strong>
              <p style={{ ...styles.p, fontSize: 13, margin: "2px 0 0" }}>{eq.desc}</p>
            </div>
            {equipment.includes(eq.id) && <span style={{ marginLeft: "auto", color: theme.accent, fontSize: 20 }}>✓</span>}
          </div>
        ))}
        <div style={{ ...styles.card, opacity: 0.6, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 28 }}>🏋️</span>
          <div>
            <strong style={{ fontSize: 15 }}>Bodyweight</strong>
            <p style={{ ...styles.p, fontSize: 13, margin: "2px 0 0" }}>Always available — no equipment needed</p>
          </div>
          <span style={{ marginLeft: "auto", color: theme.success, fontSize: 20 }}>✓</span>
        </div>
        <button style={styles.btn} onClick={async () => {
          await saveEquipment(equipment);
          completeOnboarding();
        }}>Start Training →</button>
      </div>
    ),
  ];

  // ============================================================
  // HOME SCREEN
  // ============================================================
  const HomeScreen = () => {
    const planEntries = Object.entries(weekPlan).filter(([_, v]) => v && v !== "rest");
    const hasAnyPlan = Object.keys(weekPlan).length > 0;
    const today = DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
    const todayWorkout = (weekPlan[today] && weekPlan[today] !== "rest") ? ALL_WORKOUTS.find(w => w.id === weekPlan[today]) : null;

    return (
      <div style={styles.page}>
        <h1 style={styles.h1}>DO MY WORKOUT</h1>
        {monthLabel && <p style={{ color: theme.accent, fontSize: 14, fontWeight: 600, margin: "0 0 16px", letterSpacing: 1 }}>{monthLabel}</p>}

        {todayWorkout && (
          <div style={{ ...styles.card, borderLeft: `4px solid ${WORKOUT_TYPES[todayWorkout.type].color}`, cursor: "pointer" }}
            onClick={() => { setActiveWorkout(todayWorkout); navigateTo("workout"); }}>
            <p style={{ fontSize: 12, color: theme.accent, fontWeight: 700, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: 1 }}>Today — {today}</p>
            <h3 style={{ ...styles.h3, margin: "0 0 4px" }}>{todayWorkout.name}</h3>
            <span style={styles.tag(WORKOUT_TYPES[todayWorkout.type].color)}>{WORKOUT_TYPES[todayWorkout.type].short}</span>
            <p style={{ ...styles.p, fontSize: 13, margin: "8px 0 0" }}>{todayWorkout.description}</p>
            <div style={{ ...styles.btn, marginTop: 12, padding: "12px 20px", fontSize: 14 }}>Start Workout →</div>
          </div>
        )}

        {!todayWorkout && weekPlan[today] === "rest" && planEntries.length > 0 && (
          <div style={{ ...styles.card, textAlign: "center", padding: 24 }}>
            <p style={{ fontSize: 15, color: theme.text, fontWeight: 600, margin: "0 0 8px" }}>Today is a rest day</p>
            <p style={{ ...styles.p, margin: 0 }}>Recovery is part of the program. Your body builds muscle while you rest. Pick any workout below if you're itching to move.</p>
          </div>
        )}

        {planEntries.length === 0 && (
          <div style={{ ...styles.card, textAlign: "center", padding: 24 }}>
            <p style={{ fontSize: 15, color: theme.text, margin: "0 0 8px", fontWeight: 600 }}>No plan built yet</p>
            <p style={{ ...styles.p, margin: "0 0 16px" }}>Head over to My Plan to build this month's workout schedule, then come back here to start your workouts.</p>
            <button style={styles.btn} onClick={() => navigateTo("plan")}>Build This Month's Plan →</button>
          </div>
        )}

        {planEntries.length > 0 && (
          <>
            <h2 style={styles.h2}>THIS WEEK'S LINEUP</h2>
            {DAYS.map(day => {
              const wid = weekPlan[day];
              const isRest = !wid || wid === "rest";
              const w = (!isRest) ? ALL_WORKOUTS.find(x => x.id === wid) : null;
              if (isRest) return (
                <div key={day} style={{ ...styles.card, opacity: 0.5, padding: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 14, color: theme.textDim }}>{day}</span>
                  <span style={{ fontSize: 13, color: theme.textDim }}>Rest day</span>
                </div>
              );
              const lastLog = getLastLog(w.id);
              return (
                <div key={day} style={{ ...styles.card, padding: 12, cursor: "pointer", borderLeft: `3px solid ${WORKOUT_TYPES[w.type].color}` }}
                  onClick={() => { setActiveWorkout(w); navigateTo("workout"); }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p style={{ fontSize: 12, color: theme.textDim, margin: "0 0 2px", fontWeight: 600 }}>{day}</p>
                      <strong style={{ fontSize: 15 }}>{w.name}</strong>
                    </div>
                    <span style={styles.tag(WORKOUT_TYPES[w.type].color)}>{WORKOUT_TYPES[w.type].short}</span>
                  </div>
                  {lastLog && <p style={{ fontSize: 12, color: theme.success, margin: "6px 0 0" }}>Last: {new Date(lastLog.date).toLocaleDateString()}</p>}
                </div>
              );
            })}
          </>
        )}
      </div>
    );
  };

  // ============================================================
  // PLAN SCREEN - Guided builder
  // ============================================================
  const PlanScreen = () => {
    const [localMonth, setLocalMonth] = useState(monthLabel);
    const [confirmReset, setConfirmReset] = useState(false);

    // Figure out which types are already assigned
    const assignedTypes = {};
    Object.entries(weekPlan).forEach(([day, val]) => {
      if (val && val !== "rest") {
        const w = ALL_WORKOUTS.find(x => x.id === val);
        if (w) assignedTypes[w.type] = day;
      }
    });

    const allTypesAssigned = Object.keys(WORKOUT_TYPES).every(t => assignedTypes[t]);
    const hasAnyAssignment = Object.values(weekPlan).some(v => v && v !== "rest");

    // Which types still need to be assigned
    const unassignedTypes = Object.keys(WORKOUT_TYPES).filter(t => !assignedTypes[t]);

    const removeFromDay = async (day) => {
      const next = { ...weekPlan };
      delete next[day];
      await saveWeekPlan(next);
    };

    const setRestDay = async (day) => {
      const next = { ...weekPlan, [day]: "rest" };
      await saveWeekPlan(next);
    };

    // For each day, determine what actions are available
    const getDayStatus = (day) => {
      const val = weekPlan[day];
      if (!val) return "empty";
      if (val === "rest") return "rest";
      const w = ALL_WORKOUTS.find(x => x.id === val);
      return w ? "assigned" : "empty";
    };

    return (
      <div style={styles.page}>
        <h1 style={styles.h1}>BUILD THIS MONTH'S PLAN</h1>
        <p style={styles.p}>
          Your week needs 4 workouts — one of each type — with the rest as recovery days. Tap a day to assign a workout or mark it as rest.
        </p>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 13, color: theme.textMuted, fontWeight: 600 }}>Name this month (optional)</label>
          <input style={{ ...styles.input, marginTop: 6 }} value={localMonth} placeholder="e.g. April — Foundation Month"
            onChange={e => setLocalMonth(e.target.value)}
            onBlur={() => saveMonthLabel(localMonth)} />
        </div>

        {/* Progress indicator */}
        <div style={{ ...styles.card, background: theme.accentSoft, borderColor: theme.accent, marginBottom: 20, padding: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <strong style={{ fontSize: 14 }}>Workouts assigned</strong>
            <span style={{ fontSize: 14, color: allTypesAssigned ? theme.success : theme.accent, fontWeight: 700 }}>
              {Object.keys(assignedTypes).length} / 4
            </span>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {Object.entries(WORKOUT_TYPES).map(([key, t]) => (
              <span key={key} style={{
                ...styles.tag(assignedTypes[key] ? theme.success : theme.textDim),
                opacity: assignedTypes[key] ? 1 : 0.5,
                textDecoration: assignedTypes[key] ? "none" : "none",
              }}>
                {assignedTypes[key] ? "✓ " : ""}{t.short}
              </span>
            ))}
          </div>
        </div>

        {/* Days */}
        {DAYS.map(day => {
          const status = getDayStatus(day);
          const val = weekPlan[day];
          const w = (val && val !== "rest") ? ALL_WORKOUTS.find(x => x.id === val) : null;

          return (
            <div key={day} style={{
              ...styles.card, padding: 14,
              borderLeft: w ? `4px solid ${WORKOUT_TYPES[w.type].color}` : status === "rest" ? `4px solid ${theme.border}` : `4px solid transparent`,
              opacity: status === "rest" ? 0.6 : 1,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong style={{ fontSize: 15 }}>{day}</strong>
                {status !== "empty" && (
                  <button style={{ background: "none", border: "none", color: theme.textDim, fontSize: 14, cursor: "pointer", padding: "2px 6px" }}
                    onClick={() => removeFromDay(day)}>✕ Clear</button>
                )}
              </div>

              {/* Assigned workout */}
              {w && (
                <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={styles.tag(WORKOUT_TYPES[w.type].color)}>{WORKOUT_TYPES[w.type].short}</span>
                  <span style={{ fontSize: 14 }}>{w.name}</span>
                </div>
              )}

              {/* Rest day */}
              {status === "rest" && (
                <p style={{ fontSize: 14, color: theme.textDim, margin: "8px 0 0" }}>Rest / Recovery day</p>
              )}

              {/* Empty - show options */}
              {status === "empty" && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
                  {/* Only show unassigned workout types */}
                  {unassignedTypes.map(typeKey => (
                    <button key={typeKey} style={{
                      ...styles.btnSmall, fontSize: 13, padding: "8px 12px",
                      borderColor: WORKOUT_TYPES[typeKey].color,
                      color: WORKOUT_TYPES[typeKey].color,
                    }}
                      onClick={() => {
                        setPlanSlot({ day, type: typeKey });
                        setBrowseFilter({ type: typeKey, equip: null });
                        navigateTo("library");
                      }}>
                      + {WORKOUT_TYPES[typeKey].short}
                    </button>
                  ))}
                  <button style={{ ...styles.btnSmall, fontSize: 13, padding: "8px 12px", color: theme.textDim }}
                    onClick={() => setRestDay(day)}>
                    Rest Day
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {hasAnyAssignment && !confirmReset && (
          <div style={{ marginTop: 20 }}>
            <button style={styles.btnOutline} onClick={() => setConfirmReset(true)}>Start New Month</button>
          </div>
        )}

        {confirmReset && (
          <div style={{ ...styles.card, marginTop: 20, background: "#E9456022", borderColor: theme.accent, textAlign: "center", padding: 20 }}>
            <p style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 600, color: theme.text }}>Start fresh?</p>
            <p style={{ ...styles.p, fontSize: 14, margin: "0 0 16px" }}>This will clear your current plan so you can build a new month. Your workout history will be kept.</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={{ ...styles.btn, flex: 1 }} onClick={async () => {
                await saveWeekPlan({});
                await saveMonthLabel("");
                setLocalMonth("");
                setConfirmReset(false);
              }}>Yes, Reset</button>
              <button style={{ ...styles.btnOutline, flex: 1 }} onClick={() => setConfirmReset(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ============================================================
  // LIBRARY SCREEN
  // ============================================================
  const LibraryScreen = () => {
    return (
      <div style={styles.page}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
          {planSlot && <button style={styles.backBtn} onClick={() => { setPlanSlot(null); setBrowseFilter({ type: null, equip: null }); navigateTo("plan"); }}>←</button>}
          <h1 style={{ ...styles.h1, margin: 0 }}>{planSlot ? `PICK ${WORKOUT_TYPES[planSlot.type].short.toUpperCase()}` : "WORKOUT LIBRARY"}</h1>
        </div>

        {planSlot && <p style={styles.p}>Choose a workout for {planSlot.day}</p>}

        {/* Type filter */}
        {!planSlot && (
          <div style={{ marginBottom: 8 }}>
            <span style={styles.chip(!browseFilter.type)} onClick={() => setBrowseFilter(f => ({ ...f, type: null }))}>All Types</span>
            {Object.entries(WORKOUT_TYPES).map(([key, t]) => (
              <span key={key} style={styles.chip(browseFilter.type === key)} onClick={() => setBrowseFilter(f => ({ ...f, type: key }))}>{t.short}</span>
            ))}
          </div>
        )}

        {/* Equipment filter */}
        <div style={{ marginBottom: 16 }}>
          <span style={styles.chip(!browseFilter.equip)} onClick={() => setBrowseFilter(f => ({ ...f, equip: null }))}>All Equipment</span>
          {EQUIPMENT_OPTIONS.filter(e => e.id === "bodyweight" || equipment.includes(e.id)).map(eq => (
            <span key={eq.id} style={styles.chip(browseFilter.equip === eq.id)} onClick={() => setBrowseFilter(f => ({ ...f, equip: eq.id }))}>{eq.icon} {eq.label}</span>
          ))}
        </div>

        {filteredWorkouts.length === 0 && (
          <div style={{ ...styles.card, textAlign: "center", padding: 24 }}>
            <p style={styles.p}>No workouts match these filters. Try adjusting your equipment in settings.</p>
          </div>
        )}

        {filteredWorkouts.map(w => (
          <div key={w.id} style={{ ...styles.card, cursor: "pointer", borderLeft: `3px solid ${WORKOUT_TYPES[w.type].color}` }}
            onClick={() => {
              if (planSlot) {
                // Assign to plan
                const next = { ...weekPlan, [planSlot.day]: w.id };
                saveWeekPlan(next);
                setPlanSlot(null);
                setBrowseFilter({ type: null, equip: null });
                navigateTo("plan");
              } else {
                setActiveWorkout(w);
                navigateTo("workout");
              }
            }}>
            <div style={{ display: "flex", gap: 6, marginBottom: 6, flexWrap: "wrap" }}>
              <span style={styles.tag(WORKOUT_TYPES[w.type].color)}>{WORKOUT_TYPES[w.type].short}</span>
              <span style={styles.tag("#888")}>{EQUIPMENT_OPTIONS.find(e => e.id === w.equipment)?.icon} {EQUIPMENT_OPTIONS.find(e => e.id === w.equipment)?.label}</span>
            </div>
            <h3 style={{ ...styles.h3, margin: "0 0 4px" }}>{w.name}</h3>
            <p style={{ ...styles.p, fontSize: 13, margin: 0 }}>{w.description}</p>
            {planSlot && <div style={{ color: theme.accent, fontSize: 13, fontWeight: 600, marginTop: 8 }}>Tap to assign to {planSlot.day} →</div>}
          </div>
        ))}
      </div>
    );
  };

  // ============================================================
  // WORKOUT / LOGGING SCREEN
  // ============================================================
  const WorkoutScreen = () => {
    const w = activeWorkout;
    if (!w) return null;
    const typeInfo = WORKOUT_TYPES[w.type];
    const isEndurance = w.type === "strength-endurance";
    const isHypertrophy = w.type === "strength-hypertrophy";
    const isCardio = w.type.startsWith("cardio");
    const lastLog = getLastLog(w.id);

    const [currentLog, setCurrentLog] = useState(() => {
      if (isCardio) return { duration: "", notes: "" };
      const exData = {};
      w.exercises.forEach(ex => {
        exData[ex.id] = [];
        for (let s = 0; s < ex.sets; s++) {
          if (isEndurance) exData[ex.id].push({ reps: "" });
          else exData[ex.id].push({ weight: "", reps: "" });
        }
      });
      return { exercises: exData, notes: "" };
    });

    const updateSet = (exId, setIdx, field, value) => {
      setCurrentLog(prev => {
        const next = { ...prev, exercises: { ...prev.exercises } };
        next.exercises[exId] = [...next.exercises[exId]];
        next.exercises[exId][setIdx] = { ...next.exercises[exId][setIdx], [field]: value };
        return next;
      });
    };

    const saveLog = async () => {
      const entry = { date: new Date().toISOString(), ...currentLog };
      const next = { ...workoutLogs };
      if (!next[w.id]) next[w.id] = [];
      next[w.id].push(entry);
      await saveWorkoutLogs(next);
      navigateTo("home");
    };

    // Get last log data for an exercise/set
    const getLastSetData = (exId, setIdx) => {
      if (!lastLog || !lastLog.exercises) return null;
      const exLog = lastLog.exercises[exId];
      if (!exLog || !exLog[setIdx]) return null;
      return exLog[setIdx];
    };

    return (
      <div style={styles.page}>
        <button style={styles.backBtn} onClick={() => navigateTo("home")}>← Back</button>
        <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
          <span style={styles.tag(typeInfo.color)}>{typeInfo.short}</span>
          <span style={styles.tag("#888")}>{EQUIPMENT_OPTIONS.find(e => e.id === w.equipment)?.label}</span>
        </div>
        <h1 style={{ ...styles.h1, marginBottom: 4 }}>{w.name}</h1>
        <p style={{ ...styles.p, marginBottom: 20 }}>{w.description}</p>

        {/* Warmup */}
        {w.warmup && (
          <div style={{ ...styles.card, background: "#F2CC8F22", borderColor: theme.warning, marginBottom: 12, padding: 14 }}>
            <p style={{ margin: "0 0 6px", fontSize: 14, color: theme.text, fontWeight: 600 }}>Warm-Up First:</p>
            <p style={{ margin: 0, fontSize: 13, color: theme.text, lineHeight: 1.5 }}>{w.warmup}</p>
          </div>
        )}

        {isHypertrophy && (
          <div style={{ ...styles.card, background: theme.accentSoft, borderColor: theme.accent, marginBottom: 20 }}>
            <p style={{ margin: "0 0 8px", fontSize: 14, color: theme.text, lineHeight: 1.5, fontWeight: 600 }}>How to do this workout:</p>
            <p style={{ margin: "0 0 6px", fontSize: 13, color: theme.text, lineHeight: 1.5 }}>
              Each exercise has 4 sets. A "set" means doing the exercise a certain number of times, resting, and then doing it again. Aim for 6-10 reps (repetitions) per set.
            </p>
            <p style={{ margin: "0 0 6px", fontSize: 13, color: theme.text, lineHeight: 1.5 }}>
              Pick a weight that makes the last 2-3 reps feel hard. Record the weight and reps for each set below.
            </p>
            <p style={{ margin: 0, fontSize: 13, color: theme.text, lineHeight: 1.5 }}>
              <strong>Getting stronger:</strong> When you can do 10 reps on every set, increase the weight by 5 lbs for upper body exercises or 10 lbs for legs next time. That's it — that's how you get stronger over time.
            </p>
          </div>
        )}
        {isEndurance && (
          <div style={{ ...styles.card, background: "#81B29A22", borderColor: theme.success, marginBottom: 20 }}>
            <p style={{ margin: "0 0 8px", fontSize: 14, color: theme.text, lineHeight: 1.5, fontWeight: 600 }}>How to do this workout:</p>
            <p style={{ margin: "0 0 6px", fontSize: 13, color: theme.text, lineHeight: 1.5 }}>
              Each exercise has 3 sets. A "set" means doing the exercise as many times as you can (with good form), then resting for 60-90 seconds before doing it again.
            </p>
            <p style={{ margin: 0, fontSize: 13, color: theme.text, lineHeight: 1.5 }}>
              Record how many reps you completed in each set. Next time you do this workout, try to beat those numbers. That's your progress.
            </p>
          </div>
        )}
        {isCardio && (
          <div style={{ ...styles.card, background: "#81B29A22", borderColor: theme.success, marginBottom: 20 }}>
            <p style={{ margin: "0 0 8px", fontSize: 14, color: theme.text, lineHeight: 1.5, fontWeight: 600 }}>How to do this workout:</p>
            <p style={{ margin: 0, fontSize: 13, color: theme.text, lineHeight: 1.5 }}>
              Read the instructions below, do the workout, then come back and log how long it took and any notes about how it went. Consistency matters more than perfection — just show up and move.
            </p>
          </div>
        )}

        {/* Modifications */}
        {w.modifications && (
          <div style={{ ...styles.card, background: theme.card, marginBottom: 20, padding: 14 }}>
            <p style={{ margin: "0 0 6px", fontSize: 14, color: theme.text, fontWeight: 600 }}>Need to modify?</p>
            <p style={{ margin: 0, fontSize: 13, color: theme.textMuted, lineHeight: 1.5 }}>{w.modifications}</p>
          </div>
        )}

        {/* Exercises */}
        {!isCardio && w.exercises.map(ex => (
          <div key={ex.id} style={{ ...styles.card, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: 12, color: typeInfo.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{ex.category}</span>
                <h3 style={{ ...styles.h3, margin: "4px 0" }}>{ex.name}</h3>
              </div>
              {ex.videoUrl && (
                <a href={ex.videoUrl} target="_blank" rel="noopener noreferrer"
                  style={{ ...styles.btnSmall, fontSize: 12, textDecoration: "none", padding: "6px 10px", whiteSpace: "nowrap" }}>
                  📹 Form
                </a>
              )}
            </div>
            <p style={{ ...styles.p, fontSize: 13, margin: "4px 0 12px" }}>{ex.notes}</p>

            {/* Set tracking */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {currentLog.exercises[ex.id].map((setData, si) => {
                const lastSet = getLastSetData(ex.id, si);
                return (
                  <div key={si}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 13, color: theme.textDim, minWidth: 48, fontWeight: 600 }}>Set {si + 1}</span>
                      {isHypertrophy && (
                        <input type="number" inputMode="decimal" placeholder="lbs"
                          style={{ ...styles.input, width: 80, padding: "10px 8px", textAlign: "center" }}
                          value={setData.weight} onChange={e => updateSet(ex.id, si, "weight", e.target.value)} />
                      )}
                      <input type="number" inputMode="numeric" placeholder="reps"
                        style={{ ...styles.input, width: 80, padding: "10px 8px", textAlign: "center" }}
                        value={setData.reps} onChange={e => updateSet(ex.id, si, "reps", e.target.value)} />
                      {isHypertrophy && <span style={{ fontSize: 12, color: theme.textDim }}>lbs × reps</span>}
                      {isEndurance && <span style={{ fontSize: 12, color: theme.textDim }}>reps</span>}
                    </div>
                    {lastSet && (
                      <p style={{ fontSize: 12, color: theme.textDim, margin: "4px 0 0 56px" }}>
                        Last time: {isHypertrophy ? `${lastSet.weight || "?"}lbs × ${lastSet.reps || "?"}` : `${lastSet.reps || "?"} reps`}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Cardio logging */}
        {isCardio && (
          <div style={styles.card}>
            <h3 style={{ ...styles.h3, margin: "0 0 12px" }}>Log Your Session</h3>
            <label style={{ fontSize: 13, color: theme.textMuted, fontWeight: 600 }}>Duration (minutes)</label>
            <input type="number" inputMode="numeric" style={{ ...styles.input, marginTop: 6, marginBottom: 16 }}
              placeholder="e.g. 45"
              value={currentLog.duration} onChange={e => setCurrentLog(p => ({ ...p, duration: e.target.value }))} />
            {lastLog && <p style={{ fontSize: 12, color: theme.textDim, margin: "-8px 0 12px" }}>Last time: {lastLog.duration || "?"} min</p>}
          </div>
        )}

        {/* Notes */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 13, color: theme.textMuted, fontWeight: 600 }}>Notes (optional)</label>
          <textarea style={{ ...styles.input, marginTop: 6, minHeight: 60, resize: "vertical" }}
            placeholder="How'd it feel? Anything to remember?"
            value={currentLog.notes || ""} onChange={e => setCurrentLog(p => ({ ...p, notes: e.target.value }))} />
        </div>

        <button style={styles.btn} onClick={saveLog}>✓ Log Workout</button>
        <div style={{ height: 40 }} />
      </div>
    );
  };

  // ============================================================
  // HISTORY SCREEN
  // ============================================================
  const HistoryScreen = () => {
    const allLogs = [];
    Object.entries(workoutLogs).forEach(([wid, logs]) => {
      const w = ALL_WORKOUTS.find(x => x.id === wid);
      if (w && logs) {
        logs.forEach(log => allLogs.push({ ...log, workout: w }));
      }
    });
    allLogs.sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
      <div style={styles.page}>
        <h1 style={styles.h1}>HISTORY</h1>
        {allLogs.length === 0 && (
          <div style={{ ...styles.card, textAlign: "center", padding: 24 }}>
            <p style={{ fontSize: 40, margin: "0 0 8px" }}>📊</p>
            <p style={styles.p}>No workouts logged yet. Get after it!</p>
          </div>
        )}
        {allLogs.map((log, i) => {
          const w = log.workout;
          const typeInfo = WORKOUT_TYPES[w.type];
          const isCardio = w.type.startsWith("cardio");
          return (
            <div key={i} style={{ ...styles.card, borderLeft: `3px solid ${typeInfo.color}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <div>
                  <p style={{ fontSize: 12, color: theme.textDim, margin: "0 0 2px" }}>{new Date(log.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</p>
                  <strong style={{ fontSize: 15 }}>{w.name}</strong>
                </div>
                <span style={styles.tag(typeInfo.color)}>{typeInfo.short}</span>
              </div>
              {isCardio && log.duration && <p style={{ fontSize: 13, color: theme.textMuted, margin: "8px 0 0" }}>Duration: {log.duration} min</p>}
              {!isCardio && log.exercises && (
                <div style={{ marginTop: 8 }}>
                  {w.exercises.map(ex => {
                    const exLog = log.exercises[ex.id];
                    if (!exLog) return null;
                    return (
                      <div key={ex.id} style={{ marginBottom: 4 }}>
                        <span style={{ fontSize: 12, color: theme.textMuted }}>{ex.name}: </span>
                        <span style={{ fontSize: 12, color: theme.text }}>
                          {exLog.map((s, si) => {
                            if (w.type === "strength-hypertrophy") return `${s.weight || 0}×${s.reps || 0}`;
                            return `${s.reps || 0}`;
                          }).join(" / ")}
                          {w.type === "strength-hypertrophy" ? " lbs×reps" : " reps"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
              {log.notes && <p style={{ fontSize: 12, color: theme.textDim, margin: "8px 0 0", fontStyle: "italic" }}>"{log.notes}"</p>}
            </div>
          );
        })}
      </div>
    );
  };

  // ============================================================
  // BUILD WORKOUT SCREEN
  // ============================================================
  const BuildScreen = () => {
    const [bName, setBName] = useState("");
    const [bDesc, setBDesc] = useState("");
    const [bType, setBType] = useState("strength-endurance");
    const [bEquip, setBEquip] = useState("bodyweight");
    const [bExercises, setBExercises] = useState([]);
    const [saved, setSaved] = useState(false);

    const addExercise = () => {
      setBExercises(prev => [...prev, {
        id: `e${Date.now()}`,
        name: "",
        category: "push",
        sets: bType.startsWith("cardio") ? 1 : 3,
        notes: "",
        videoUrl: "",
      }]);
    };

    const updateExercise = (idx, field, value) => {
      setBExercises(prev => {
        const next = [...prev];
        next[idx] = { ...next[idx], [field]: value };
        return next;
      });
    };

    const removeExercise = (idx) => {
      setBExercises(prev => prev.filter((_, i) => i !== idx));
    };

    const saveWorkout = async () => {
      if (!bName.trim() || bExercises.length === 0) return;
      const newWorkout = {
        id: `custom-${Date.now()}`,
        name: bName.trim(),
        description: bDesc.trim() || "Custom workout",
        type: bType,
        equipment: bEquip,
        custom: true,
        exercises: bExercises.map((ex, i) => ({
          ...ex,
          id: `e${i + 1}`,
          sets: parseInt(ex.sets) || 3,
          videoUrl: ex.videoUrl || "",
        })),
      };
      const next = [...customWorkouts, newWorkout];
      await saveCustomWorkouts(next);
      setSaved(true);
      setTimeout(() => {
        setBName(""); setBDesc(""); setBExercises([]); setSaved(false);
      }, 2000);
    };

    const isCardio = bType.startsWith("cardio");
    const categories = isCardio ? ["cardio"] : ["push", "pull", "legs"];

    return (
      <div style={styles.page}>
        <h1 style={styles.h1}>BUILD A WORKOUT</h1>
        <p style={styles.p}>Create your own workout. It'll show up in the Workouts library and can be added to your monthly plan.</p>

        {saved && (
          <div style={{ ...styles.card, background: "#81B29A33", borderColor: theme.success, textAlign: "center", padding: 16 }}>
            <p style={{ margin: 0, color: theme.success, fontWeight: 600 }}>Workout saved! Find it in your Workouts tab.</p>
          </div>
        )}

        {/* Name */}
        <label style={{ fontSize: 13, color: theme.textMuted, fontWeight: 600 }}>Workout name</label>
        <input style={{ ...styles.input, marginTop: 6, marginBottom: 16 }} value={bName}
          placeholder="e.g. Spicy Core Day" onChange={e => setBName(e.target.value)} />

        {/* Description */}
        <label style={{ fontSize: 13, color: theme.textMuted, fontWeight: 600 }}>Short description</label>
        <input style={{ ...styles.input, marginTop: 6, marginBottom: 16 }} value={bDesc}
          placeholder="e.g. The one that makes you question your choices" onChange={e => setBDesc(e.target.value)} />

        {/* Type */}
        <label style={{ fontSize: 13, color: theme.textMuted, fontWeight: 600, display: "block", marginBottom: 8 }}>Workout type</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
          {Object.entries(WORKOUT_TYPES).map(([key, t]) => (
            <span key={key} style={styles.chip(bType === key)} onClick={() => { setBType(key); setBExercises([]); }}>{t.short}</span>
          ))}
        </div>

        {/* Equipment */}
        <label style={{ fontSize: 13, color: theme.textMuted, fontWeight: 600, display: "block", marginBottom: 8 }}>Equipment</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
          {EQUIPMENT_OPTIONS.map(eq => (
            <span key={eq.id} style={styles.chip(bEquip === eq.id)} onClick={() => setBEquip(eq.id)}>{eq.icon} {eq.label}</span>
          ))}
        </div>

        {/* Exercises */}
        <h2 style={styles.h2}>EXERCISES</h2>
        {!isCardio && <p style={styles.p}>Add at least one exercise for each category: push, pull, and legs.</p>}

        {bExercises.map((ex, idx) => (
          <div key={idx} style={{ ...styles.card, padding: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <strong style={{ fontSize: 14 }}>Exercise {idx + 1}</strong>
              <button style={{ background: "none", border: "none", color: theme.accent, cursor: "pointer", fontSize: 13 }}
                onClick={() => removeExercise(idx)}>Remove</button>
            </div>

            <input style={{ ...styles.input, marginBottom: 8 }} value={ex.name} placeholder="Exercise name"
              onChange={e => updateExercise(idx, "name", e.target.value)} />

            {!isCardio && (
              <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                {categories.map(cat => (
                  <span key={cat} style={styles.chip(ex.category === cat)}
                    onClick={() => updateExercise(idx, "category", cat)}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </span>
                ))}
              </div>
            )}

            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 12, color: theme.textDim }}>Sets</label>
                <input type="number" inputMode="numeric" style={{ ...styles.input, marginTop: 4 }}
                  value={ex.sets} onChange={e => updateExercise(idx, "sets", e.target.value)} />
              </div>
            </div>

            <input style={{ ...styles.input, marginBottom: 8 }} value={ex.notes} placeholder="Tips or notes (optional)"
              onChange={e => updateExercise(idx, "notes", e.target.value)} />

            <input style={styles.input} value={ex.videoUrl} placeholder="YouTube search link for form (optional)"
              onChange={e => updateExercise(idx, "videoUrl", e.target.value)} />
          </div>
        ))}

        <button style={{ ...styles.btnOutline, marginBottom: 20 }} onClick={addExercise}>
          + Add Exercise
        </button>

        {bExercises.length > 0 && bName.trim() && (
          <button style={styles.btn} onClick={saveWorkout}>Save Workout</button>
        )}

        {/* List custom workouts */}
        {customWorkouts.length > 0 && (
          <>
            <h2 style={styles.h2}>YOUR CUSTOM WORKOUTS</h2>
            {customWorkouts.map((w, i) => (
              <div key={w.id} style={{ ...styles.card, borderLeft: `3px solid ${WORKOUT_TYPES[w.type]?.color || "#888"}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                  <div>
                    <span style={styles.tag(WORKOUT_TYPES[w.type]?.color || "#888")}>{WORKOUT_TYPES[w.type]?.short}</span>
                    <h3 style={{ ...styles.h3, margin: "4px 0" }}>{w.name}</h3>
                    <p style={{ ...styles.p, fontSize: 13, margin: 0 }}>{w.description}</p>
                  </div>
                  <button style={{ background: "none", border: "none", color: theme.accent, cursor: "pointer", fontSize: 12, whiteSpace: "nowrap", padding: "4px" }}
                    onClick={async () => {
                      const next = customWorkouts.filter(x => x.id !== w.id);
                      await saveCustomWorkouts(next);
                    }}>Delete</button>
                </div>
              </div>
            ))}
          </>
        )}
        <div style={{ height: 20 }} />
      </div>
    );
  };

  // ============================================================
  // SETTINGS SCREEN
  // ============================================================
  const SettingsScreen = () => {
    const [confirmClear, setConfirmClear] = useState(false);
    return (
      <div style={styles.page}>
        <h1 style={styles.h1}>SETTINGS</h1>

        <h2 style={styles.h2}>MY EQUIPMENT</h2>
        <p style={styles.p}>Tap to toggle. This filters which workouts appear in your library.</p>
        {EQUIPMENT_OPTIONS.filter(e => e.id !== "bodyweight").map(eq => (
          <div key={eq.id}
            onClick={async () => {
              const next = equipment.includes(eq.id) ? equipment.filter(e => e !== eq.id) : [...equipment, eq.id];
              await saveEquipment(next);
            }}
            style={{
              ...styles.card, display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
              border: equipment.includes(eq.id) ? `2px solid ${theme.accent}` : `1px solid ${theme.border}`,
              background: equipment.includes(eq.id) ? theme.accentSoft : theme.card,
              padding: 14,
            }}>
            <span style={{ fontSize: 24 }}>{eq.icon}</span>
            <strong style={{ fontSize: 14 }}>{eq.label}</strong>
            {equipment.includes(eq.id) && <span style={{ marginLeft: "auto", color: theme.accent }}>✓</span>}
          </div>
        ))}

        <h2 style={styles.h2}>ABOUT DADLIFT</h2>
        <button style={{ ...styles.btnOutline, marginBottom: 12 }} onClick={() => { setScreen("onboard"); setOnboardStep(0); }}>
          Replay Intro
        </button>

        <h2 style={styles.h2}>DATA</h2>
        {!confirmClear ? (
          <button style={{ ...styles.btnOutline, borderColor: "#E07A5F", color: "#E07A5F" }} onClick={() => setConfirmClear(true)}>
            Clear Workout History
          </button>
        ) : (
          <div style={{ ...styles.card, background: "#E9456022", borderColor: theme.accent, textAlign: "center", padding: 20 }}>
            <p style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 600, color: theme.text }}>Are you sure?</p>
            <p style={{ ...styles.p, fontSize: 14, margin: "0 0 16px" }}>This will permanently delete all your workout logs.</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={{ ...styles.btn, flex: 1 }} onClick={async () => {
                await saveWorkoutLogs({});
                setConfirmClear(false);
              }}>Yes, Clear All</button>
              <button style={{ ...styles.btnOutline, flex: 1 }} onClick={() => setConfirmClear(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ============================================================
  // INFO MODAL
  // ============================================================
  const InfoModal = () => (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.85)", zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }} onClick={() => setShowInfo(false)}>
      <div style={{ ...styles.card, maxWidth: 400, maxHeight: "80vh", overflow: "auto", background: theme.bg }}
        onClick={e => e.stopPropagation()}>
        <h2 style={{ ...styles.h2, margin: "0 0 12px" }}>HOW THIS WORKS</h2>
        <p style={{ ...styles.p, fontSize: 14 }}>
          <strong style={{ color: theme.text }}>4 workouts per week.</strong> Two strength, two cardio.
        </p>
        <p style={{ ...styles.p, fontSize: 14 }}>
          <strong style={{ color: theme.text }}>Each strength session</strong> hits Push + Pull + Legs in one workout. Endurance day = max reps, light weight. Hypertrophy day = heavier weight, track increases.
        </p>
        <p style={{ ...styles.p, fontSize: 14 }}>
          <strong style={{ color: theme.text }}>Each cardio session</strong> is either long & steady (L2) or short & intense (VO2 Max).
        </p>
        <p style={{ ...styles.p, fontSize: 14 }}>
          <strong style={{ color: theme.text }}>Monthly rotation:</strong> Pick 4 workouts, run them for a month, then swap in new ones to keep progressing.
        </p>
        <button style={{ ...styles.btn, marginTop: 12 }} onClick={() => setShowInfo(false)}>Got It</button>
      </div>
    </div>
  );

  // ============================================================
  // RENDER
  // ============================================================
  if (screen === "loading") return (
    <div style={{ ...styles.app, display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ ...styles.logo, fontSize: 40 }}>DADLIFT</h1>
        <p style={{ color: theme.textDim }}>Loading...</p>
      </div>
    </div>
  );

  if (screen === "onboard") return (
    <div style={styles.app}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet" />
      <div style={styles.scrollArea} ref={scrollRef}>
        {onboardScreens[onboardStep]()}
      </div>
    </div>
  );

  const mainScreens = { plan: PlanScreen, home: HomeScreen, library: LibraryScreen, build: BuildScreen, workout: WorkoutScreen, history: HistoryScreen, settings: SettingsScreen };
  const CurrentScreen = mainScreens[screen] || PlanScreen;

  return (
    <div style={styles.app}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.logo} onClick={() => navigateTo("plan")}>DADLIFT</h1>
        <button style={{ background: "none", border: "none", color: theme.textMuted, fontSize: 22, cursor: "pointer" }}
          onClick={() => setShowInfo(true)}>ℹ️</button>
      </div>

      {/* Content */}
      <div style={styles.scrollArea} ref={scrollRef}>
        <CurrentScreen />
      </div>

      {/* Bottom Nav */}
      {screen !== "workout" && (
        <div style={styles.nav}>
          {[
            { id: "plan", icon: "📋", label: "My Plan" },
            { id: "home", icon: "🏋️", label: "Do Workout" },
            { id: "history", icon: "📊", label: "Progress" },
            { id: "library", icon: "📚", label: "Workouts" },
            { id: "build", icon: "🔨", label: "Build" },
            { id: "settings", icon: "⚙️", label: "Settings" },
          ].map(tab => (
            <button key={tab.id} style={styles.navBtn(screen === tab.id)} onClick={() => navigateTo(tab.id)}>
              <span style={{ fontSize: 20 }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Info Modal */}
      {showInfo && <InfoModal />}
    </div>
  );
}
