<template>
  <div id="EEZeusApp">
    <router-view></router-view>
  </div>
</template>

<script>
import { Meteor } from 'meteor/meteor'

export default {
  data() {
    return {}
  },
  created() {

    // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
    let vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    window.addEventListener('resize', () => {
      // We execute the same script as before
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    });
  }
}
</script>

<style lang="scss">
body {
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
  font-family: 'Courier New', Courier, monospace;
}

@supports (-webkit-touch-callout: none) {
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
}

#EEZeusApp {
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
}

.modal-card {
  .delete {
    background-color: transparent;

    &::after {
      height: 100%;
      background-color: black;
    }

    &:before {
      width: 100%;
      background-color: black;
    }
  }
}

.ee-table {
  border: 1px solid #ccc;
  border-radius: 3px;
}

.subpage {
  padding: 10px 20px 20px 20px;
  position: relative;
  background-color: #f0f0f0;

  .top-menu {
    display: block;
    font-size: 18px;

    a {
      display: inline-block;
      padding: 12px 18px;
      border-radius: 6px;
      margin: 0;
      color: #000;
      border: none;
      transition: all 0.5s ease;
      text-decoration: none;

      &:hover {
        background-color: #ddd;
      }

      &.router-link-exact-active {
        background: #ccc;
        color: #000;

        &:hover {
          background: #ddd;
        }
      }
    }
  }

  .actions-end {
    position: fixed;
    right: 0px;
    bottom: 0px;
    padding: 10px;
    background: #f0f0f0;
    text-align: right;

    button {
      font-weight: bold;

      &:hover {
        background-color: #666;
      }
    }
  }
}

table.table {
  td.text {
    text-transform: capitalize;
    ;
  }

  td.price {
    text-align: right;

    &:after {
      content: '€';
    }
  }
}

.icon.actionable {
  position: relative;
  transition: all 0.5s ease;
  width: 40px;
  height: 40px;
  background: #0001;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    color: #777;
  }

  &.no-background {
    background-color: inherit;
    opacity: 0.5;

    &.active {
      opacity: 1;
    }
  }
}

.b-table {

  .table-wrapper,
  .table-wrapper.has-sticky-header {

    thead {

      tr,
      tr:first-child {
        th {

          &:first-child {
            border-top-left-radius: 4px;
          }

          &:last-child {
            border-top-right-radius: 4px;
          }
        }
      }
    }

    tr {

      th.segleft,
      td.segleft {
        border-left: 6px solid #f0f0f0;
      }

      th.segright,
      td.segright {
        border-right: 6px solid #f0f0f0;
      }
    }
  }

  &.unified {

    .table-wrapper,
    .table-wrapper.has-sticky-header {

      thead {

        tr,
        tr:first-child {
          th {
            background-color: #fff;

            &:first-child {
              border-top-left-radius: 4px;
            }

            &:last-child {
              border-top-right-radius: 4px;
            }
          }
        }
      }

      tr {

        th.segleft,
        td.segleft {
          border-left: 6px solid #f0f0f0;
        }

        th.segright,
        td.segright {
          border-right: 6px solid #f0f0f0;
        }

        td,
        th {
          background-color: #fff;
        }
      }

      .table {

        th,
        td {
          border: 0;
        }

        th {
          text-decoration: underline;
        }
      }
    }
  }

  &.segleft {
    thead {
      tr {

        th:last-child,
        td:last-child {
          border-left: 6px solid #f0f0f0;
        }
      }
    }
  }

  &.segright {
    thead {
      tr {

        th:first-child,
        td:first-child {
          border-right: 6px solid #f0f0f0;
        }
      }
    }
  }
}

.modal-close {
  background: rgba(10, 10, 10, 0.2);
}

.modal-card-foot {
  justify-content: flex-end;
}

.buttons.centered {
  justify-content: center;
}

.title.is-4 {
  font-size: 1rem;
  text-transform: uppercase;
  font-weight: NORMAL;
}

.tag.outlined {
  border: 1px solid #ccc;
}
</style>
