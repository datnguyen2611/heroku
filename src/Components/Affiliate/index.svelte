<script>
    import {
        expanded,
        component,
        isMobile,
        userAddress,
        addressBNB,
        abi_contract,
        selected,
        selectWallet,
        provider,
        userInfo,
        notification,
    } from '../../store';
    import { ethers } from 'ethers';
    let referral = `localhost:3000/?ref=${$userAddress}`;
    let total = false;

    let allMem = $userAddress ? $userInfo.member.reduce((a, b) => a + b) : 0;
    let allValue = $userAddress ? $userInfo.sales.reduce((a, b) => a + b) : 0;

    const copyTextToClipboard = async text => {
        await navigator.clipboard.writeText(text);
        $notification = {
            message: 'Copied to clipboard!',
            type: 'info',
            timeout: 3000,
        };
    };
</script>

<style lang="scss">
    @import './affiliate.scss';
</style>

<div class="affiliate">
    <div class="title">
        <p>Affiliate Marketing</p>
        {#if $isMobile}
            <button
                on:click={() => {
                    $expanded = false;
                    $component = 'hamburger';
                }}>
                <i class="fas fa-chevron-left" />
            </button>
        {:else}
            <button
                on:click={() => {
                    $expanded = false;
                    $component = '';
                }}>
                <i class="fas fa-times" />
            </button>
        {/if}
    </div>
    {#if $userAddress === ''}
        <button
            class="connect_btn"
            on:click={() => {
                $selectWallet = true;
            }}>
            Connect to wallet
        </button>
    {:else}
        <div class="ref">
            <div class="address">
                Ref link
                <br />
                <b>{referral.substr(0, 20) + '...'}</b>
            </div>

            <div
                class="copy"
                on:click={() => {
                    copyTextToClipboard(referral);
                }}>
                Copy
            </div>
        </div>
        <div class="wrap-income">
            <div class="income" on:click={() => (total = !total)}>
                <div class="item">
                    <p>Total member</p>
                    <span>{allMem}</span>
                </div>
                <div class="item">
                    <p>Sales</p>
                    <span>${allValue}</span>
                </div>
            </div>

            <div class="income" on:click={() => (total = !total)}>
                <div class="item">
                    <p>F1</p>
                    <span>{$userInfo.member[0]}</span>
                </div>
                <div class="item">
                    <p>Sales</p>
                    <span>${$userInfo.sales[0]}</span>
                </div>
            </div>

            <div class="income" on:click={() => (total = !total)}>
                <div class="item">
                    <p>F2</p>
                    <span>{$userInfo.member[1]}</span>
                </div>
                <div class="item">
                    <p>Sales</p>
                    <span>${$userInfo.sales[1]}</span>
                </div>
            </div>

            <div class="income" on:click={() => (total = !total)}>
                <div class="item">
                    <p>F3</p>
                    <span>{$userInfo.member[2]}</span>
                </div>
                <div class="item">
                    <p>Sales</p>
                    <span>${$userInfo.sales[2]}</span>
                </div>
            </div>

            <div class="income" on:click={() => (total = !total)}>
                <div class="item">
                    <p>F4</p>
                    <span>{$userInfo.member[3]}</span>
                </div>
                <div class="item">
                    <p>Sales</p>
                    <span>${$userInfo.sales[3]}</span>
                </div>
            </div>

            <div class="income" on:click={() => (total = !total)}>
                <div class="item">
                    <p>F5</p>
                    <span>{$userInfo.member[4]}</span>
                </div>
                <div class="item">
                    <p>Sales</p>
                    <span>${$userInfo.sales[4]}</span>
                </div>
            </div>
            <!-- <div class="details" class:details--active={total}>
              <table>
                  <tr>
                      <th>Address</th>
                      <th>Time</th>
                      <th>Commission </th>
                  </tr>
                  <tr>
                      <td>0x8F...6EE3</td>
                      <td
                          >12:30:00 <br />
                          06/18/2021</td
                      >
                      <td
                          >+0.005 <br />
                          0.25</td
                      >
                  </tr>
                  <tr>
                      <td>0x8F...6EE3</td>
                      <td
                          >12:30:00 <br />
                          06/18/2021</td
                      >
                      <td
                          >+0.005 <br />
                          0.25</td
                      >
                  </tr>
                  <tr>
                      <td>0x8F...6EE3</td>
                      <td
                          >12:30:00 <br />
                          06/18/2021</td
                      >
                      <td
                          >+0.005 <br />
                          0.25</td
                      >
                  </tr>
              </table>
          </div> -->
        </div>
    {/if}
</div>
