/*
	Dimension by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$footer = $('#footer'),
		$main = $('#main'),
		$main_articles = $main.children('article');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$body.removeClass('is-preload');

	// Track active article for up-indicator visibility.
		function updateUpIndicator() {
			var h = location.hash;
			if (h === '#intro' || h === '' || h === '#') {
				$body.addClass('is-intro-visible');
			} else {
				$body.removeClass('is-intro-visible');
			}
		}
		$window.on('hashchange', updateUpIndicator);
		updateUpIndicator();

	// Scroll through panels in order.
		var navOrder = ['intro', 'work', 'contact', 'words'];
		var scrollLocked = false;

	// Hide scroll indicator on the last panel.
		function updateScrollIndicator() {
			var h = location.hash.replace('#', '');
			if (h === navOrder[navOrder.length - 1]) {
				$body.addClass('is-last-panel');
			} else {
				$body.removeClass('is-last-panel');
			}
		}
		$window.on('hashchange', updateScrollIndicator);
		updateScrollIndicator();

		$window.on('wheel', function(event) {
			if (scrollLocked) return;

			var delta = event.originalEvent.deltaY;
			if (Math.abs(delta) < 30) return;

			if (!$body.hasClass('is-article-visible')) {
				if (delta > 0) {
					scrollLocked = true;
					setTimeout(function() { scrollLocked = false; }, 1200);
					location.hash = '#' + navOrder[0];
				}
			} else {
				var current = $main_articles.filter('.active').attr('id');
				var idx = navOrder.indexOf(current);
				if (idx === -1) return;

				var scrollTop   = $window.scrollTop();
				var fitsInView  = $(document).height() <= $window.height() + 10;
				var atTop       = scrollTop <= 5 || fitsInView;
				var atBottom    = scrollTop + $window.height() >= $(document).height() - 5 || fitsInView;

				if (delta > 0 && atBottom) {
					if (idx < navOrder.length - 1) {
						scrollLocked = true;
						setTimeout(function() { scrollLocked = false; }, 1200);
						$window.scrollTop(0);
						location.hash = '#' + navOrder[idx + 1];
					}
				} else if (delta < 0 && atTop) {
					scrollLocked = true;
					setTimeout(function() { scrollLocked = false; }, 1200);
					$window.scrollTop(0);
					if (idx > 0)
						location.hash = '#' + navOrder[idx - 1];
					else
						$main._hide(true);
				}
			}
		});

	// Fix: Flexbox min-height bug on IE.
		if (browser.name == 'ie') {

			var flexboxFixTimeoutId;

			$window.on('resize.flexbox-fix', function() {

				clearTimeout(flexboxFixTimeoutId);

				flexboxFixTimeoutId = setTimeout(function() {

					if ($wrapper.prop('scrollHeight') > $window.height())
						$wrapper.css('height', 'auto');
					else
						$wrapper.css('height', '100vh');

				}, 250);

			}).triggerHandler('resize.flexbox-fix');

		}

	// Nav.
		var $nav = $header.children('nav'),
			$nav_li = $nav.find('li');

		// Add "middle" alignment classes if we're dealing with an even number of items.
			if ($nav_li.length % 2 == 0) {

				$nav.addClass('use-middle');
				$nav_li.eq( ($nav_li.length / 2) ).addClass('is-middle');

			}

	// Main.
		var	delay = 325,
			locked = false;

		// Methods.
			$main._show = function(id, initial) {

				var $article = $main_articles.filter('#' + id);

				// No such article? Bail.
					if ($article.length == 0)
						return;

				// Handle lock.

					// Already locked? Speed through "show" steps w/o delays.
						if (locked || (typeof initial != 'undefined' && initial === true)) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Mark as visible.
								$body.addClass('is-article-visible');

							// Deactivate all articles (just in case one's already active).
								$main_articles.removeClass('active');

							// Hide header, footer.
								$header.hide();
								$footer.hide();

							// Show main, article.
								$main.show();
								$article.show();

							// Activate article.
								$article.addClass('active');

							// Unlock.
								locked = false;

							// Unmark as switching.
								setTimeout(function() {
									$body.removeClass('is-switching');
								}, (initial ? 1000 : 0));

							return;

						}

					// Lock.
						locked = true;

				// Article already visible? Just swap articles.
					if ($body.hasClass('is-article-visible')) {

						// Deactivate current article.
							var $currentArticle = $main_articles.filter('.active');

							$currentArticle.removeClass('active');

						// Show article.
							setTimeout(function() {

								// Hide current article.
									$currentArticle.hide();

								// Show article.
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

				// Otherwise, handle as normal.
					else {

						// Mark as visible.
							$body
								.addClass('is-article-visible');

						// Show article.
							setTimeout(function() {

								// Hide header, footer.
									$header.hide();
									$footer.hide();

								// Show main, article.
									$main.show();
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

			};

			$main._hide = function(addState) {

				var $article = $main_articles.filter('.active');

				// Article not visible? Bail.
					if (!$body.hasClass('is-article-visible'))
						return;

				// Add state?
					if (typeof addState != 'undefined'
					&&	addState === true)
						history.pushState(null, null, '#');

				// Handle lock.

					// Already locked? Speed through "hide" steps w/o delays.
						if (locked) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Deactivate article.
								$article.removeClass('active');

							// Hide article, main.
								$article.hide();
								$main.hide();

							// Show footer, header.
								$footer.show();
								$header.show();

							// Unmark as visible.
								$body.removeClass('is-article-visible');

							// Unlock.
								locked = false;

							// Unmark as switching.
								$body.removeClass('is-switching');

							// Window stuff.
								$window
									.scrollTop(0)
									.triggerHandler('resize.flexbox-fix');

							return;

						}

					// Lock.
						locked = true;

				// Deactivate article.
					$article.removeClass('active');

				// Hide article.
					setTimeout(function() {

						// Hide article, main.
							$article.hide();
							$main.hide();

						// Show footer, header.
							$footer.show();
							$header.show();

						// Unmark as visible.
							setTimeout(function() {

								$body.removeClass('is-article-visible');

								// Window stuff.
									$window
										.scrollTop(0)
										.triggerHandler('resize.flexbox-fix');

								// Unlock.
									setTimeout(function() {
										locked = false;
									}, delay);

							}, 25);

					}, delay);


			};

		// Articles.
			$main_articles.each(function() {

				var $this = $(this);

				// Close.
					$('<div class="close">Close</div>')
						.appendTo($this)
						.on('click', function() {
							location.hash = '';
						});

				// Prevent clicks from inside article from bubbling.
					$this.on('click', function(event) {
						event.stopPropagation();
					});

			});

		// Convert **bold** and *italic* markers to HTML.
			var colors = {
				orange: '#e8a87c',
				blue:   '#7cb2e8'
			};

			function parseInline(text) {
				return text
					.replace(/\[(.+?)\]\{(.+?)\}/g, function(_, word, color) {
						return '<span style="color:' + (colors[color] || color) + '">' + word + '</span>';
					})
					.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
					.replace(/\*(.+?)\*/g, '<em>$1</em>');
			}

		// Load word history and reflections into Tidbits panel.
			(function() {
				Promise.all([
					fetch('data/words-history.json').then(function(r) { return r.json(); }),
					fetch('data/reflections.json').then(function(r) { return r.json(); })
				]).then(function(results) {
					var history     = results[0];
					var reflections = results[1];
					var container   = document.getElementById('words-entries');
					container.innerHTML = '';
					history.forEach(function(entry, i) {
						var wordEl = document.createElement('h3');
						wordEl.textContent = entry.word;
						var dateEl = document.createElement('p');
						dateEl.className = 'words-date';
						dateEl.textContent = entry.date;
						container.appendChild(wordEl);
						container.appendChild(dateEl);
						var match = reflections.find(function(r) { return r.date === entry.date; });
						if (match && match.text) {
							var reflEl = document.createElement('p');
							reflEl.innerHTML = parseInline(match.text);
							container.appendChild(reflEl);
						}
						if (i < history.length - 1) {
							container.appendChild(document.createElement('hr'));
						}
					});
				}).catch(function() {});
			})();

		// Events.
			$body.on('click', function(event) {

				// Article visible? Hide.
					if ($body.hasClass('is-article-visible'))
						$main._hide(true);

			});

			$window.on('keyup', function(event) {

				switch (event.keyCode) {

					case 27:

						// Article visible? Hide.
							if ($body.hasClass('is-article-visible'))
								$main._hide(true);

						break;

					default:
						break;

				}

			});

			$window.on('hashchange', function(event) {

				// Empty hash?
					if (location.hash == ''
					||	location.hash == '#') {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Hide.
							$main._hide();

					}

				// Otherwise, check for a matching article.
					else if ($main_articles.filter(location.hash).length > 0) {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Show article.
							$main._show(location.hash.substr(1));

					}

			});

		// Scroll restoration.
		// This prevents the page from scrolling back to the top on a hashchange.
			if ('scrollRestoration' in history)
				history.scrollRestoration = 'manual';
			else {

				var	oldScrollPos = 0,
					scrollPos = 0,
					$htmlbody = $('html,body');

				$window
					.on('scroll', function() {

						oldScrollPos = scrollPos;
						scrollPos = $htmlbody.scrollTop();

					})
					.on('hashchange', function() {
						$window.scrollTop(oldScrollPos);
					});

			}

		// Initialize.

			// Hide main, articles.
				$main.hide();
				$main_articles.hide();

			// Initial article.
				if (location.hash != ''
				&&	location.hash != '#')
					$window.on('load', function() {
						$main._show(location.hash.substr(1), true);
					});

})(jQuery);